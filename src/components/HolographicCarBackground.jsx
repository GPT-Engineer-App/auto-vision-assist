import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const HolographicCarBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create a holographic material
    const holographicMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec3 color = vec3(0.5 + 0.5 * sin(vUv.x * 10.0 + time), 0.5 + 0.5 * sin(vUv.y * 10.0 - time), 1.0);
          gl_FragColor = vec4(color, 0.5);
        }
      `,
      transparent: true,
    });

    // Create a simple car shape
    const carGeometry = new THREE.Group();

    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const bodyMesh = new THREE.Mesh(bodyGeometry, holographicMaterial);
    carGeometry.add(bodyMesh);

    // Car roof
    const roofGeometry = new THREE.BoxGeometry(2, 1, 2);
    const roofMesh = new THREE.Mesh(roofGeometry, holographicMaterial);
    roofMesh.position.set(-0.5, 1, 0);
    carGeometry.add(roofMesh);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const wheelPositions = [
      { x: -1.5, y: -0.5, z: 1 },
      { x: 1.5, y: -0.5, z: 1 },
      { x: -1.5, y: -0.5, z: -1 },
      { x: 1.5, y: -0.5, z: -1 },
    ];

    wheelPositions.forEach((position) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(position.x, position.y, position.z);
      wheel.rotation.z = Math.PI / 2;
      carGeometry.add(wheel);
    });

    scene.add(carGeometry);

    // Position camera
    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      holographicMaterial.uniforms.time.value += 0.05;
      carGeometry.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      holographicMaterial.dispose();
      bodyGeometry.dispose();
      roofGeometry.dispose();
      wheelGeometry.dispose();
      wheelMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default HolographicCarBackground;