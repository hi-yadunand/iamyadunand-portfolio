(function () {
  const DIST = 4.6;
  const FIT = 0.86;
  const SETTINGS = {
    resolution: 26,
    stiffness: 0.05,
    damping: 0.2,
    grabRadius: 0.58,
    pull: 0.42,
    wobble: 4.4,
    tilt: 10,
    shading: 0.22,
    radius: 9999,
  };

  const vertexShader = `
    precision highp float;
    attribute vec2 aGrid;
    attribute vec2 aUv;
    attribute vec3 aOffset;
    attribute vec3 aNormal;
    uniform float uAspect;
    uniform float uTilt;
    uniform float uDist;
    uniform float uFit;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vDepth;
    void main() {
      vUv = aUv;
      vec2 base = vec2((aGrid.x * 2.0 - 1.0) * uAspect, 1.0 - aGrid.y * 2.0);
      vec3 p = vec3(base + aOffset.xy, aOffset.z);
      float ct = cos(uTilt);
      float st = sin(uTilt);
      float ry = p.y * ct - p.z * st;
      float rz = p.y * st + p.z * ct;
      p.y = ry;
      p.z = rz;
      float persp = uDist / (uDist - p.z);
      vec2 clip = vec2(p.x / uAspect, p.y) * persp * uFit;
      vNormal = aNormal;
      vDepth = aOffset.z;
      gl_Position = vec4(clip, 0.0, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying float vDepth;
    uniform sampler2D tMap;
    uniform float uShading;
    uniform vec2 uRes;
    uniform float uRadius;
    void main() {
      vec4 tex = texture2D(tMap, vUv);
      vec3 n = normalize(vNormal);
      vec3 light = normalize(vec3(-0.35, 0.55, 0.78));
      float diff = clamp(dot(n, light), 0.0, 1.0);
      float depth = clamp(1.0 + vDepth * 0.32, 0.78, 1.12);
      vec3 color = tex.rgb * (1.0 - uShading * 0.16);
      color += tex.rgb * diff * uShading * 0.28;
      color *= depth;

      vec2 p = (vUv - 0.5) * uRes;
      vec2 halfRes = uRes * 0.5;
      float r = min(uRadius, min(halfRes.x, halfRes.y));
      vec2 q = abs(p) - (halfRes - r);
      float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
      float alpha = tex.a * (1.0 - smoothstep(-1.25, 1.25, sd));
      if (alpha <= 0.002) discard;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || "Shader compile failed");
    }
    return shader;
  }

  function createProgram(gl) {
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
    }
    return program;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function initElasticMesh(container) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const fallback = container.querySelector(".elastic-mesh__fallback");
    const src = container.dataset.image || fallback?.getAttribute("src");
    if (!src) return;

    const program = createProgram(gl);
    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const n = Math.max(6, Math.min(40, SETTINGS.resolution));
    const nodeCount = n * n;
    const grid = new Float32Array(nodeCount * 2);
    const uv = new Float32Array(nodeCount * 2);
    const offset = new Float32Array(nodeCount * 3);
    const normal = new Float32Array(nodeCount * 3);
    const baseX = new Float32Array(nodeCount);
    const baseY = new Float32Array(nodeCount);
    const pos = new Float32Array(nodeCount * 3);
    const vel = new Float32Array(nodeCount * 3);
    const accel = new Float32Array(nodeCount * 3);

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const idx = j * n + i;
        const u = i / (n - 1);
        const v = j / (n - 1);
        grid[idx * 2] = u;
        grid[idx * 2 + 1] = v;
        uv[idx * 2] = u;
        uv[idx * 2 + 1] = 1 - v;
        normal[idx * 3 + 2] = 1;
      }
    }

    const indices = new Uint16Array((n - 1) * (n - 1) * 6);
    let ti = 0;
    for (let j = 0; j < n - 1; j++) {
      for (let i = 0; i < n - 1; i++) {
        const a = j * n + i;
        const b = a + 1;
        const c = a + n;
        const d = c + 1;
        indices[ti++] = a;
        indices[ti++] = c;
        indices[ti++] = b;
        indices[ti++] = b;
        indices[ti++] = c;
        indices[ti++] = d;
      }
    }

    function bindAttribute(name, size, data, usage) {
      const buffer = gl.createBuffer();
      const location = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage || gl.STATIC_DRAW);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
      return buffer;
    }

    bindAttribute("aGrid", 2, grid);
    bindAttribute("aUv", 2, uv);
    const offsetBuffer = bindAttribute("aOffset", 3, offset, gl.DYNAMIC_DRAW);
    const normalBuffer = bindAttribute("aNormal", 3, normal, gl.DYNAMIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const uniforms = {
      aspect: gl.getUniformLocation(program, "uAspect"),
      tilt: gl.getUniformLocation(program, "uTilt"),
      dist: gl.getUniformLocation(program, "uDist"),
      fit: gl.getUniformLocation(program, "uFit"),
      shading: gl.getUniformLocation(program, "uShading"),
      res: gl.getUniformLocation(program, "uRes"),
      radius: gl.getUniformLocation(program, "uRadius"),
      map: gl.getUniformLocation(program, "tMap"),
    };

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uniforms.map, 0);

    let aspect = 1;
    function refreshBase() {
      for (let idx = 0; idx < nodeCount; idx++) {
        baseX[idx] = (grid[idx * 2] * 2 - 1) * aspect;
        baseY[idx] = 1 - grid[idx * 2 + 1] * 2;
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      const width = Math.max(2, Math.floor(rect.width));
      const height = Math.max(2, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = width / height;
      gl.useProgram(program);
      gl.uniform1f(uniforms.aspect, aspect);
      gl.uniform2f(uniforms.res, width, height);
      gl.uniform1f(uniforms.radius, SETTINGS.radius);
      refreshBase();
    }

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, targetActive: false };
    function toPlane(clientX, clientY) {
      const rect = container.getBoundingClientRect();
      const mx = (clientX - rect.left) / rect.width;
      const my = (clientY - rect.top) / rect.height;
      const clipX = mx * 2 - 1;
      const clipY = 1 - my * 2;
      const tilt = (SETTINGS.tilt * Math.PI) / 180;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      const a = clipY / (ct * FIT * DIST);
      const py = (a * DIST) / (1 + a * st);
      const persp = DIST / (DIST - py * st);
      pointer.tx = (clipX * aspect) / (persp * FIT);
      pointer.ty = py;
    }

    function onMove(event) {
      toPlane(event.clientX, event.clientY);
      pointer.targetActive = true;
    }
    function onLeave() {
      pointer.targetActive = false;
    }
    function onTouch(event) {
      if (!event.touches.length) return;
      toPlane(event.touches[0].clientX, event.touches[0].clientY);
      pointer.targetActive = true;
    }

    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerenter", onMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("touchstart", onTouch, { passive: true });
    container.addEventListener("touchmove", onTouch, { passive: true });
    container.addEventListener("touchend", onLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    container.appendChild(canvas);
    resize();

    function substep() {
      const s = SETTINGS.stiffness;
      const retain = 1 - SETTINGS.damping;
      const coupling = 0.06 + SETTINGS.wobble * 0.032;
      const active = pointer.active;
      const radius = Math.max(0.08, SETTINGS.grabRadius) * 1.4;
      const invRadius = 1 / radius;
      const force = SETTINGS.pull * 0.009;

      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const idx = j * n + i;
          const o3 = idx * 3;
          const ox = pos[o3];
          const oy = pos[o3 + 1];
          const oz = pos[o3 + 2];
          let ax = -s * ox;
          let ay = -s * oy;
          let az = -s * oz;
          let sx = 0;
          let sy = 0;
          let sz = 0;
          let count = 0;

          if (i > 0) {
            const k = (idx - 1) * 3;
            sx += pos[k];
            sy += pos[k + 1];
            sz += pos[k + 2];
            count++;
          }
          if (i < n - 1) {
            const k = (idx + 1) * 3;
            sx += pos[k];
            sy += pos[k + 1];
            sz += pos[k + 2];
            count++;
          }
          if (j > 0) {
            const k = (idx - n) * 3;
            sx += pos[k];
            sy += pos[k + 1];
            sz += pos[k + 2];
            count++;
          }
          if (j < n - 1) {
            const k = (idx + n) * 3;
            sx += pos[k];
            sy += pos[k + 1];
            sz += pos[k + 2];
            count++;
          }

          ax += coupling * (sx - count * ox);
          ay += coupling * (sy - count * oy);
          az += coupling * (sz - count * oz);

          if (active) {
            const dx = pointer.x - (baseX[idx] + ox);
            const dy = pointer.y - (baseY[idx] + oy);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const t = dist * invRadius;
            if (t < 1) {
              const zBump = 1 - t * t;
              az += force * zBump * zBump * 6;
              if (dist > 0.0001) {
                const pinch = t * (1 - t) * (1 - t) * 6.75;
                const dir = (force * pinch * 1.6) / dist;
                ax += dx * dir;
                ay += dy * dir;
              }
            }
          }

          accel[o3] = ax;
          accel[o3 + 1] = ay;
          accel[o3 + 2] = az;
        }
      }

      for (let idx = 0; idx < nodeCount; idx++) {
        const o3 = idx * 3;
        vel[o3] = (vel[o3] + accel[o3]) * retain;
        vel[o3 + 1] = (vel[o3 + 1] + accel[o3 + 1]) * retain;
        vel[o3 + 2] = (vel[o3 + 2] + accel[o3 + 2]) * retain;
        pos[o3] = Math.max(-1.2, Math.min(1.2, pos[o3] + vel[o3]));
        pos[o3 + 1] = Math.max(-1.2, Math.min(1.2, pos[o3 + 1] + vel[o3 + 1]));
        pos[o3 + 2] = Math.max(-1.2, Math.min(1.2, pos[o3 + 2] + vel[o3 + 2]));
      }
    }

    function commit() {
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const idx = j * n + i;
          const o3 = idx * 3;
          const left = i > 0 ? idx - 1 : idx;
          const right = i < n - 1 ? idx + 1 : idx;
          const down = j > 0 ? idx - n : idx;
          const up = j < n - 1 ? idx + n : idx;

          const lx = baseX[left] + pos[left * 3];
          const ly = baseY[left] + pos[left * 3 + 1];
          const lz = pos[left * 3 + 2];
          const rx = baseX[right] + pos[right * 3];
          const ry = baseY[right] + pos[right * 3 + 1];
          const rz = pos[right * 3 + 2];
          const dx = baseX[down] + pos[down * 3];
          const dy = baseY[down] + pos[down * 3 + 1];
          const dz = pos[down * 3 + 2];
          const ux = baseX[up] + pos[up * 3];
          const uy = baseY[up] + pos[up * 3 + 1];
          const uz = pos[up * 3 + 2];
          const txx = rx - lx;
          const txy = ry - ly;
          const txz = rz - lz;
          const tyx = ux - dx;
          const tyy = uy - dy;
          const tyz = uz - dz;
          let nx = txy * tyz - txz * tyy;
          let ny = txz * tyx - txx * tyz;
          let nz = txx * tyy - txy * tyx;
          if (nz < 0) {
            nx = -nx;
            ny = -ny;
            nz = -nz;
          }
          const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
          normal[o3] = nx / len;
          normal[o3 + 1] = ny / len;
          normal[o3 + 2] = nz / len;
          offset[o3] = pos[o3];
          offset[o3 + 1] = pos[o3 + 1];
          offset[o3 + 2] = pos[o3 + 2];
        }
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, offsetBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, offset);
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, normal);
    }

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const step = 1 / 120;
    function frame(now) {
      raf = requestAnimationFrame(frame);
      let dt = (now - last) / 1000;
      last = now;
      dt = Math.min(dt, 0.25);

      const k = 1 - Math.exp(-Math.max(dt, 0.0001) / 0.06);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      pointer.active = pointer.targetActive;

      acc += dt;
      let sub = 0;
      while (acc >= step && sub < 5) {
        substep();
        acc -= step;
        sub++;
      }
      if (acc > step) acc = 0;

      commit();
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.tilt, (SETTINGS.tilt * Math.PI) / 180);
      gl.uniform1f(uniforms.dist, DIST);
      gl.uniform1f(uniforms.fit, FIT);
      gl.uniform1f(uniforms.shading, SETTINGS.shading);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    loadImage(src)
      .then((img) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        container.classList.add("is-ready");
        raf = requestAnimationFrame(frame);
      })
      .catch(() => {
        if (canvas.parentElement === container) container.removeChild(canvas);
      });

    window.addEventListener("beforeunload", () => cancelAnimationFrame(raf), { once: true });
  }

  function initAll() {
    document.querySelectorAll("[data-elastic-mesh]").forEach(initElasticMesh);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
