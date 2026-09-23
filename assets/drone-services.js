import * as THREE from "https://esm.sh/three@0.160.0";
import { DRACOLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (current, target, amount) => current + (target - current) * amount;
const smootherStep = (value) => {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const easeOutPower = (value, power = 2.6) => {
  const t = clamp(value, 0, 1);
  return 1 - Math.pow(1 - t, power);
};
const easeInOutCubic = (value) => {
  const t = clamp(value, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

ready(() => {
  const root = document.querySelector("[data-drone-services]");
  const stage = root?.querySelector("[data-drone-stage]");
  const canvas = root?.querySelector("[data-drone-canvas]");

  if (!root || !stage || !canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  let renderer = null;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    root.classList.add("is-fallback");
    return;
  }

  const drone = new THREE.Group();
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  const targetPosition = { x: 0, y: 0 };
  const currentPosition = { x: 0, y: 0 };
  const entrance = {
    triggered: reduceMotion.matches,
    startTime: reduceMotion.matches ? 0 : null,
    progress: reduceMotion.matches ? 1 : 0,
    offscreenX: 0,
  };
  const propellers = [];
  const propellerSpinQuaternion = new THREE.Quaternion();
  const shadowMeshNames = new Set([
    "Circle.006",
    "Circle006",
    "Circle.006_0",
    "Circle006_0",
  ]);
  const propellerNames = new Set([
    "Circle.002",
    "Circle.003",
    "Circle.004",
    "Circle.005",
    "Circle002",
    "Circle003",
    "Circle004",
    "Circle005",
  ]);
  const propellerSpinSpeed = 64;
  let loadedModel = null;
  let frameId = 0;
  let previousTime = 0;
  let isVisible = false;
  let currentBank = 0;
  const sideFlip = {
    active: false,
    startTime: 0,
    duration: 1180,
    direction: 1,
    nextTime: 0,
  };

  const scheduleSideFlip = (time) => {
    sideFlip.nextTime = time + 5600 + Math.random() * 6200;
  };

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  camera.position.set(0, 0.34, 6.2);
  scene.add(camera);
  scene.add(drone);

  const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
  keyLight.position.set(2.8, 4.2, 5.5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.6);
  fillLight.position.set(-4, 1.5, 3);
  scene.add(fillLight);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8c8c8c, 2.1));

  const updateEntranceOffset = () => {
    const bounds = stage.getBoundingClientRect();
    const width = Math.max(2, Math.floor(bounds.width));

    const verticalWorldSize =
      2 *
      Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
      camera.position.z;
    const worldPerPixel = (verticalWorldSize * camera.aspect) / width;
    const stageCenter = bounds.left + bounds.width / 2;
    const offscreenPixels = stageCenter + Math.max(180, bounds.width * 0.24);
    entrance.offscreenX = -Math.max(5.4, offscreenPixels * worldPerPixel);
  };

  const resize = () => {
    const bounds = stage.getBoundingClientRect();
    const width = Math.max(2, Math.floor(bounds.width));
    const height = Math.max(2, Math.floor(bounds.height));

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 700 ? 10.2 : 6.2;
    camera.updateProjectionMatrix();
    updateEntranceOffset();
  };

  const movePointer = (clientX, clientY) => {
    const bounds = root.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width;
    const y = (clientY - bounds.top) / bounds.height;

    pointer.x = clamp(x * 2 - 1, -1, 1);
    pointer.y = clamp(y * 2 - 1, -1, 1);
  };

  const onPointerMove = (event) => movePointer(event.clientX, event.clientY);

  const normalizeModel = (model) => {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);
    model.position.sub(center);

    const largestSide = Math.max(size.x, size.y, size.z) || 1;
    const scale = 7.2 / largestSide;
    model.scale.setScalar(scale);
    model.rotation.set(-0.08, 0, 0);

    model.traverse((child) => {
      if (shadowMeshNames.has(child.name)) {
        child.visible = false;
        return;
      }

      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = false;
      child.material = child.material.clone();
      if (child.material.emissive) child.material.emissive.set(0x000000);
      if ("emissiveIntensity" in child.material)
        child.material.emissiveIntensity = 0;
      child.material.metalness = Math.min(
        0.82,
        child.material.metalness + 0.18,
      );
      child.material.roughness = Math.max(
        0.34,
        child.material.roughness * 0.96,
      );
    });
  };

  const collectPropellers = (model) => {
    propellers.length = 0;

    model.traverse((child) => {
      if (!propellerNames.has(child.name)) return;

      const spinAxis = new THREE.Vector3(0, 0, 1);
      if (child.geometry) {
        child.geometry.computeBoundingBox();
        const dimensions = child.geometry.boundingBox.getSize(
          new THREE.Vector3(),
        );
        if (dimensions.x <= dimensions.y && dimensions.x <= dimensions.z) {
          spinAxis.set(1, 0, 0);
        } else if (dimensions.y <= dimensions.z) {
          spinAxis.set(0, 1, 0);
        }
      }

      propellers.push({
        object: child,
        baseQuaternion: child.quaternion.clone(),
        spinAxis,
        angle: 0,
        direction: child.position.x * child.position.y >= 0 ? 1 : -1,
      });
    });
  };

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
  );

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load(
    "/assets/models/drone.glb",
    (gltf) => {
      loadedModel = gltf.scene;
      normalizeModel(loadedModel);
      collectPropellers(loadedModel);
      drone.add(loadedModel);
      root.classList.add("is-loaded");
    },
    undefined,
    () => root.classList.add("is-fallback"),
  );

  const render = (time = 0) => {
    frameId = requestAnimationFrame(render);

    const delta = previousTime
      ? Math.min((time - previousTime) * 0.001, 0.05)
      : 0;
    previousTime = time;
    if (reduceMotion.matches) {
      entrance.triggered = true;
      entrance.progress = 1;
      entrance.startTime = time;
    } else if (entrance.triggered && loadedModel) {
      if (entrance.startTime === null) entrance.startTime = time;
      entrance.progress = clamp((time - entrance.startTime) / 2700, 0, 1);
    }

    const entranceProgress = easeOutPower(entrance.progress);
    const motionProgress = smootherStep(entrance.progress);
    const entranceRemaining = 1 - entranceProgress;
    const flightEnergy = Math.sin(motionProgress * Math.PI);
    const settleProgress = clamp((entrance.progress - 0.72) / 0.28, 0, 1);
    const settleEnergy =
      Math.sin(settleProgress * Math.PI) * Math.pow(1 - settleProgress, 1.8);
    if (
      isVisible &&
      loadedModel &&
      entrance.progress >= 1 &&
      !sideFlip.active &&
      !sideFlip.nextTime
    ) {
      scheduleSideFlip(time);
    }

    if (
      !reduceMotion.matches &&
      loadedModel &&
      isVisible &&
      entrance.progress >= 1 &&
      !sideFlip.active &&
      time >= sideFlip.nextTime
    ) {
      sideFlip.active = true;
      sideFlip.startTime = time;
      sideFlip.direction = Math.random() > 0.5 ? 1 : -1;
    }

    const sideFlipProgress = sideFlip.active
      ? clamp((time - sideFlip.startTime) / sideFlip.duration, 0, 1)
      : 0;
    const sideFlipEase = easeInOutCubic(sideFlipProgress);
    const sideFlipAngle = sideFlip.direction * Math.PI * 2 * sideFlipEase;
    const sideFlipLift = Math.sin(sideFlipProgress * Math.PI) * 0.2;
    const sideFlipPitch = -Math.sin(sideFlipProgress * Math.PI * 2) * 0.08;

    if (sideFlip.active && sideFlipProgress >= 1) {
      sideFlip.active = false;
      scheduleSideFlip(time);
    }

    const flightLift =
      Math.sin(motionProgress * Math.PI) * 0.36 +
      Math.sin(entrance.progress * Math.PI * 4) * entranceRemaining * 0.035;
    const flightBank = -flightEnergy * 0.34 + settleEnergy * 0.12;
    const flightPitch = -flightEnergy * 0.15 + settleEnergy * 0.05;
    const flightYaw = flightEnergy * 0.08;
    const settleX = settleEnergy * 0.16;
    const idle = reduceMotion.matches ? 0 : Math.sin(time * 0.0005) * 0.05;
    const bob = Math.sin(time * 0.0011) * 0.045;
    target.x = finePointer.matches ? -pointer.y * 0.62 + 0.12 : 0.12;
    target.y = finePointer.matches ? pointer.x * 0.92 + idle : idle;
    targetPosition.x = finePointer.matches ? pointer.x * 0.36 : 0;
    targetPosition.y = finePointer.matches ? -pointer.y * 0.18 + bob : bob;

    current.x = lerp(current.x, target.x, 0.12);
    current.y = lerp(current.y, target.y, 0.12);
    currentPosition.x = lerp(currentPosition.x, targetPosition.x, 0.1);
    currentPosition.y = lerp(currentPosition.y, targetPosition.y, 0.1);

    drone.rotation.x = current.x + flightPitch + sideFlipPitch;
    drone.rotation.y = current.y + flightYaw;
    currentBank = lerp(
      currentBank,
      (finePointer.matches ? -pointer.x * 0.18 : 0) + flightBank,
      0.11,
    );
    drone.rotation.z = currentBank + sideFlipAngle;
    drone.position.x =
      currentPosition.x + entrance.offscreenX * entranceRemaining + settleX;
    drone.position.y = currentPosition.y + flightLift + sideFlipLift;

    propellers.forEach((propeller) => {
      const flightSpinBoost = 1 + flightEnergy * 1.1 + entranceRemaining * 0.35;
      propeller.angle +=
        delta * propellerSpinSpeed * flightSpinBoost * propeller.direction;
      propeller.object.quaternion
        .copy(propeller.baseQuaternion)
        .multiply(
          propellerSpinQuaternion.setFromAxisAngle(
            propeller.spinAxis,
            propeller.angle,
          ),
        );
    });

    renderer.render(scene, camera);
  };

  root.addEventListener("pointermove", onPointerMove, { passive: true });
  root.addEventListener("pointerleave", () => {
    pointer.x = 0;
    pointer.y = 0;
  });
  const entranceObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        updateEntranceOffset();
        entrance.triggered = true;
        entranceObserver.disconnect();
      }
    },
    { threshold: 0.28 },
  );

  entranceObserver.observe(root);
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      isVisible = entries.some((entry) => entry.isIntersecting);
      if (!isVisible && !sideFlip.active) sideFlip.nextTime = 0;
    },
    { threshold: 0.32 },
  );

  visibilityObserver.observe(root);
  window.addEventListener("resize", resize);
  reduceMotion.addEventListener?.("change", () => {
    if (reduceMotion.matches) {
      entrance.triggered = true;
      entrance.progress = 1;
    }
    resize();
  });
  resize();
  frameId = requestAnimationFrame(render);

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(frameId);
      entranceObserver.disconnect();
      visibilityObserver.disconnect();
    },
    { once: true },
  );
});
