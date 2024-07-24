import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CarWireframe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create a wireframe material with increased line width
    const material = new THREE.LineBasicMaterial({ color: 0xff6600, linewidth: 2 });

    // Create a more detailed car shape
    const carGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Body
      -2, 0, 1,    2, 0, 1,
      2, 0, -1,    -2, 0, -1,
      -2, 1, 1,    2, 1, 1,
      2, 1, -1,    -2, 1, -1,
      // Roof
      -1.5, 1, 0.5,  1.5, 1, 0.5,
      1.5, 1, -0.5,  -1.5, 1, -0.5,
      -1.5, 1.5, 0.5,  1.5, 1.5, 0.5,
      1.5, 1.5, -0.5,  -1.5, 1.5, -0.5,
      // Hood
      -2, 0.5, 1,   -1.5, 0.75, 1,
      2, 0.5, 1,    1.5, 0.75, 1,
      // Trunk
      -2, 0.5, -1,   -1.5, 0.75, -1,
      2, 0.5, -1,    1.5, 0.75, -1,
      // Windows
      -1.5, 1, 0.5,   -1.5, 1.5, 0.5,
      1.5, 1, 0.5,    1.5, 1.5, 0.5,
      1.5, 1, -0.5,   1.5, 1.5, -0.5,
      -1.5, 1, -0.5,  -1.5, 1.5, -0.5,
      // Wheels
      -1.5, 0.3, 1.1,  -1.2, 0.3, 1.1,
      1.5, 0.3, 1.1,   1.2, 0.3, 1.1,
      -1.5, 0.3, -1.1, -1.2, 0.3, -1.1,
      1.5, 0.3, -1.1,  1.2, 0.3, -1.1,
    ]);
    carGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const carWireframe = new THREE.LineSegments(carGeometry, material);
    scene.add(carWireframe);

    // Add ambient light to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Adjust camera position
    camera.position.z = 5;
    camera.position.y = 1;
    camera.position.x = -3;

    const animate = () => {
      requestAnimationFrame(animate);
      carWireframe.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      carGeometry.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default CarWireframe;