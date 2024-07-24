import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as THREE from 'three';

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const mountRef = useRef(null);

  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create a car-like shape
    const carGeometry = new THREE.BoxGeometry(2, 1, 4);
    const carMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ffff, 
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const car = new THREE.Mesh(carGeometry, carMaterial);
    scene.add(car);

    // Add some details to make it more car-like
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.set(-1, -0.5, -1);
    car.add(wheel1);

    const wheel2 = wheel1.clone();
    wheel2.position.set(1, -0.5, -1);
    car.add(wheel2);

    const wheel3 = wheel1.clone();
    wheel3.position.set(-1, -0.5, 1);
    car.add(wheel3);

    const wheel4 = wheel1.clone();
    wheel4.position.set(1, -0.5, 1);
    car.add(wheel4);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      car.rotation.y += 0.01;
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
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");
      navigate("/garage");
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-4xl w-full z-10">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Auto Vision V2</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-700 text-white border-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-gray-700 text-white border-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-center space-x-4">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                Login
              </Button>
              <Link to="/signup">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </form>
          <div className="mt-8 text-white">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Vehicle Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Easily manage and track your vehicles</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Diagnostic Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Access advanced diagnostic features</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Maintenance Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Stay on top of your vehicle maintenance</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700">
                <CardHeader>
                  <CardTitle className="text-orange-500">Performance Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Monitor and optimize your vehicle's performance</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;