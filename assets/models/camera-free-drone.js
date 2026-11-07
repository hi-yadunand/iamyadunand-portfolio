// Original camera-free quadcopter, built locally with the site's existing Three.js.
// No textures, logos, text, lenses, gimbal or external model downloads.
export function createCameraFreeDrone(THREE) {
  const model = new THREE.Group();
  model.name = "CameraFreeDrone";
  const assembly = new THREE.Group();
  assembly.rotation.set(0.32, -0.3, 0);
  model.add(assembly);

  const materials = {
    shell: new THREE.MeshStandardMaterial({ color: 0xbcc0c7, roughness: 0.43, metalness: 0.13 }),
    underside: new THREE.MeshStandardMaterial({ color: 0x45484d, roughness: 0.58, metalness: 0.15 }),
    arm: new THREE.MeshStandardMaterial({ color: 0x303338, roughness: 0.46, metalness: 0.28 }),
    motor: new THREE.MeshStandardMaterial({ color: 0x25282d, roughness: 0.36, metalness: 0.48 }),
    collar: new THREE.MeshStandardMaterial({ color: 0x969ba3, roughness: 0.28, metalness: 0.8 }),
    blade: new THREE.MeshStandardMaterial({ color: 0x25272b, roughness: 0.42, metalness: 0.2 }),
  };

  // A continuous closed outline keeps the nose smooth, with no camera opening.
  const outline = new THREE.Shape();
  outline.moveTo(-0.45, -1.4);
  outline.bezierCurveTo(-0.73, -1.4, -0.8, -1.17, -0.8, -0.82);
  outline.lineTo(-0.71, 0.96);
  outline.bezierCurveTo(-0.7, 1.24, -0.53, 1.36, -0.28, 1.36);
  outline.lineTo(0.28, 1.36);
  outline.bezierCurveTo(0.53, 1.36, 0.7, 1.24, 0.71, 0.96);
  outline.lineTo(0.8, -0.82);
  outline.bezierCurveTo(0.8, -1.17, 0.73, -1.4, 0.45, -1.4);
  outline.closePath();

  const horizontalExtrusion = (shape, depth, bevel) => {
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth, bevelEnabled: true, bevelSegments: 4,
      steps: 1, curveSegments: 16, bevelSize: bevel, bevelThickness: bevel,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, -depth / 2, 0);
    return geometry;
  };
  const addMesh = (name, geometry, material, position, parent = assembly) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
  };

  addMesh("SmoothShell", horizontalExtrusion(outline, 0.16, 0.15), materials.shell, [0, 0.16, 0]);
  const underside = addMesh("ClosedUnderside", horizontalExtrusion(outline, 0.12, 0.07), materials.underside, [0, -0.08, 0]);
  underside.scale.set(0.96, 1, 0.97);

  // Shared geometry/materials keep the model inexpensive to render and dispose.
  const jointGeometry = new THREE.CylinderGeometry(0.16, 0.16, 0.28, 24);
  const motorGeometry = new THREE.CylinderGeometry(0.22, 0.21, 0.28, 28);
  const footGeometry = new THREE.CylinderGeometry(0.15, 0.1, 0.36, 20);
  const collarGeometry = new THREE.TorusGeometry(0.205, 0.018, 6, 32);
  const hubGeometry = new THREE.CylinderGeometry(0.12, 0.14, 0.09, 24);
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0.08, -0.035);
  bladeShape.bezierCurveTo(0.3, -0.1, 0.68, -0.19, 0.98, -0.14);
  bladeShape.bezierCurveTo(1.09, -0.12, 1.08, -0.04, 1, 0);
  bladeShape.bezierCurveTo(0.7, 0.12, 0.37, 0.12, 0.08, 0.035);
  bladeShape.closePath();
  const bladeGeometry = horizontalExtrusion(bladeShape, 0.025, 0.008);

  let number = 0;
  for (const side of [-1, 1]) for (const end of [-1, 1]) {
    number++;
    const rootX = side * 0.64, rootZ = end * 0.83;
    const motorX = side * 2.05, motorZ = end * 1.37;
    const dx = motorX - rootX, dz = motorZ - rootZ;
    const length = Math.hypot(dx, dz);
    const armShape = new THREE.Shape();
    const half = length / 2, radius = 0.055, edge = 0.09;
    armShape.moveTo(-half + radius, -edge);
    armShape.lineTo(half - radius, -edge);
    armShape.quadraticCurveTo(half, -edge, half, -edge + radius);
    armShape.lineTo(half, edge - radius);
    armShape.quadraticCurveTo(half, edge, half - radius, edge);
    armShape.lineTo(-half + radius, edge);
    armShape.quadraticCurveTo(-half, edge, -half, edge - radius);
    armShape.lineTo(-half, -edge + radius);
    armShape.quadraticCurveTo(-half, -edge, -half + radius, -edge);
    armShape.closePath();
    const armGeometry = new THREE.ExtrudeGeometry(armShape, {
      depth: 0.22, bevelEnabled: true, bevelSize: 0.018,
      bevelThickness: 0.018, bevelSegments: 2, steps: 1, curveSegments: 5,
    });
    armGeometry.translate(0, 0, -0.11);
    const arm = addMesh(`FoldingArm${number}`, armGeometry, materials.arm, [(rootX + motorX) / 2, 0, (rootZ + motorZ) / 2]);
    arm.rotation.y = -Math.atan2(dz, dx);
    addMesh(`Hinge${number}`, jointGeometry, materials.arm, [rootX, 0, rootZ]);
    addMesh(`Motor${number}`, motorGeometry, materials.motor, [motorX, 0.035, motorZ]);
    addMesh(`LandingFoot${number}`, footGeometry, materials.motor, [motorX, -0.275, motorZ]);
    const collar = addMesh(`MotorCollar${number}`, collarGeometry, materials.collar, [motorX, 0.185, motorZ]);
    collar.rotation.x = Math.PI / 2;

    const rotor = new THREE.Group();
    rotor.name = `Propeller${number}`;
    rotor.position.set(motorX, 0.27, motorZ);
    rotor.rotation.y = side * end * 0.24;
    rotor.userData.isPropeller = true;
    rotor.userData.spinDirection = side * end;
    assembly.add(rotor);
    addMesh(`PropellerHub${number}`, hubGeometry, materials.motor, [0, 0, 0], rotor);
    addMesh(`Blade${number}A`, bladeGeometry, materials.blade, [0, -0.015, 0], rotor);
    const opposite = addMesh(`Blade${number}B`, bladeGeometry, materials.blade, [0, -0.015, 0], rotor);
    opposite.rotation.y = Math.PI;
  }
  return model;
}
