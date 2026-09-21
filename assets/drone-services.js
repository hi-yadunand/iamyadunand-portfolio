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
  const propellers = [];
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
  const propellerSpinAxis = new THREE.Vector3(0, 0, 1);
  const propellerSpinQuaternion = new THREE.Quaternion();
  const propellerSpinSpeed = 8;
  let loadedModel = null;
  let frameId = 0;
  let previousTime = 0;

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

  const rimLight = new THREE.DirectionalLight(0xff5a2b, 2.2);
  rimLight.position.set(0, -2, -4);
  scene.add(rimLight);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8c8c8c, 2.1));

  const resize = () => {
    const bounds = stage.getBoundingClientRect();
    const width = Math.max(2, Math.floor(bounds.width));
    const height = Math.max(2, Math.floor(bounds.height));

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 700 ? 10.2 : 6.2;
    camera.updateProjectionMatrix();
  };

  const movePointer = (clientX, clientY) => {
    const bounds = stage.getBoundingClientRect();
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
      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = false;
      child.material = child.material.clone();
      child.material.metalness = Math.min(0.82, child.material.metalness + 0.18);
      child.material.roughness = Math.max(0.28, child.material.roughness * 0.9);
    });
  };

  const collectPropellers = (model) => {
    propellers.length = 0;

    model.traverse((child) => {
      if (!propellerNames.has(child.name)) return;

      propellers.push({
        object: child,
        baseQuaternion: child.quaternion.clone(),
        angle: 0,
        direction: child.position.x * child.position.y >= 0 ? 1 : -1,
      });
    });
  };

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

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
    () => root.classList.add("is-fallback")
  );

  const render = (time = 0) => {
    frameId = requestAnimationFrame(render);

    const delta = previousTime ? Math.min((time - previousTime) * 0.001, 0.05) : 0;
    previousTime = time;
    const idle = reduceMotion.matches ? 0 : Math.sin(time * 0.0005) * 0.05;
    target.x = finePointer.matches ? -pointer.y * 0.32 + 0.12 : 0.12;
    target.y = finePointer.matches ? pointer.x * 0.52 + idle : idle;

    current.x = lerp(current.x, target.x, 0.075);
    current.y = lerp(current.y, target.y, 0.075);

    drone.rotation.x = current.x;
    drone.rotation.y = current.y;
    drone.rotation.z = lerp(drone.rotation.z, finePointer.matches ? -pointer.x * 0.08 : 0, 0.06);
    drone.position.y = Math.sin(time * 0.0011) * 0.045;

    propellers.forEach((propeller) => {
      propeller.angle += delta * propellerSpinSpeed * propeller.direction;
      propeller.object.quaternion
        .copy(propeller.baseQuaternion)
        .multiply(propellerSpinQuaternion.setFromAxisAngle(propellerSpinAxis, propeller.angle));
    });

    renderer.render(scene, camera);
  };

  stage.addEventListener("pointermove", onPointerMove, { passive: true });
  stage.addEventListener("pointerleave", () => {
    pointer.x = 0;
    pointer.y = 0;
  });
  window.addEventListener("resize", resize);
  reduceMotion.addEventListener?.("change", resize);
  resize();
  frameId = requestAnimationFrame(render);

  window.addEventListener("pagehide", () => cancelAnimationFrame(frameId), { once: true });
});
