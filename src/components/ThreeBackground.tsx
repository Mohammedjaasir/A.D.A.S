"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1.2] }}>
                <Suspense fallback={null}>
                    <group rotation={[0, 0, Math.PI / 4]}>
                        <PointsBox />
                    </group>
                    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
                        <Core />
                    </Float>
                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                </Suspense>
            </Canvas>
        </div>
    );
}

function PointsBox(props: any) {
    const ref = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const count = 3000; // Reduced for performance safety
        const radius = 1.5;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = Math.cbrt(Math.random()) * radius;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }

        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]} {...props}>
            <points ref={ref}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    transparent
                    color="#3b82f6"
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
}

function Core() {
    return (
        <Sphere visible args={[1, 100, 200]} scale={0.25} position={[0, 0, 0]}>
            <MeshDistortMaterial
                color="#60a5fa"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    )
}
