'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, useProgress, Html } from '@react-three/drei';
import { Suspense, useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

interface ThreeModelViewerProps {
    modelUrl: string;
    autoRotate?: boolean;
    glowColor?: string;
    fov?: number;
    scaleScalar?: number;
    enableControls?: boolean;
    compact?: boolean;
    initialRotation?: [number, number, number];
}

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex items-center justify-center bg-[#0c0a09]/95 px-3 py-2 rounded-lg border border-neutral-800/80 min-w-[60px]">
                <span className="mono text-[8px] text-orange-500 font-bold tracking-widest">{progress.toFixed(0)}%</span>
            </div>
        </Html>
    );
}

function Model({
    url,
    autoRotate = false,
    scaleScalar = 1,
    compact = false,
    initialRotation = [0, 0, 0],
}: {
    url: string;
    autoRotate?: boolean;
    scaleScalar?: number;
    compact?: boolean;
    initialRotation?: [number, number, number];
}) {
    const { scene } = useGLTF(url);
    const modelRef = useRef<THREE.Group>(null);
    const { camera } = useThree();
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useEffect(() => {
        if (!clonedScene || !modelRef.current) return;

        // Material quality
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (mesh.material) {
                    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                    mats.forEach((m) => {
                        if (m instanceof THREE.MeshStandardMaterial) {
                            m.roughness = Math.max(0.15, m.roughness);
                            m.metalness = Math.min(0.95, Math.max(0.05, m.metalness));
                        }
                    });
                }
            }
        });

        // ── Step 1: measure world-space bounds (respects any existing scale in the GLB) ──
        const rawBox = new THREE.Box3().setFromObject(clonedScene);
        if (rawBox.isEmpty()) return;
        const rawSize = new THREE.Vector3();
        rawBox.getSize(rawSize);
        const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z);
        if (maxDim === 0) return;

        // ── Step 2: scale FIRST using multiplyScalar so we preserve the GLB's internal
        //    scale ratios (setScalar would replace it and break models with scale ≠ 1) ──
        const multiplier = (2.0 / maxDim) * scaleScalar;
        clonedScene.scale.multiplyScalar(multiplier);

        // ── Step 3: center AFTER scaling (order matters — scaling shifts the centroid) ──
        const scaledBox = new THREE.Box3().setFromObject(clonedScene);
        const scaledCenter = new THREE.Vector3();
        scaledBox.getCenter(scaledCenter);
        clonedScene.position.sub(scaledCenter);

        // ── Step 4: place camera to tightly frame the bounding sphere ──
        const sphere = new THREE.Sphere();
        scaledBox.getBoundingSphere(sphere);
        const cam = camera as THREE.PerspectiveCamera;
        const fovRad = (cam.fov * Math.PI) / 180;
        // compact thumbnails: tighter (0.85). hero full view: fill the frame (0.78)
        const factor = compact ? 0.85 : 0.78;
        const dist = (sphere.radius / Math.sin(fovRad / 2)) * factor;
        camera.position.set(0, 0, Math.max(dist, 0.3));

        // ── Step 5: apply orientation ──
        modelRef.current.rotation.set(
            initialRotation[0],
            initialRotation[1],
            initialRotation[2]
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clonedScene, scaleScalar, compact, initialRotation]);

    useFrame((state, delta) => {
        if (!autoRotate || !modelRef.current) return;
        if (compact) {
            // Timeline thumbnails: spin on Y axis only
            modelRef.current.rotation.y += delta * 0.15;
        } else {
            // Hero: gentle float while camera orbits (OrbitControls drives azimuth)
            modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
        }
    });

    return (
        <group ref={modelRef}>
            <primitive object={clonedScene} />
        </group>
    );
}

const PROCEDURAL_POSITIONS = new Float32Array(
    Array.from({ length: 900 }, () => (Math.random() - 0.5) * 3)
);

function HolographicFallback({ color }: { color: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
        }
        if (pointsRef.current) pointsRef.current.rotation.z -= delta * 0.05;
    });

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[1.2, 16, 16]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.12} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh>
                <octahedronGeometry args={[0.5, 1]} />
                <meshStandardMaterial color={color} wireframe transparent opacity={0.4} emissive={color} emissiveIntensity={0.5} />
            </mesh>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[PROCEDURAL_POSITIONS, 3]} />
                </bufferGeometry>
                <pointsMaterial color={color} size={0.035} transparent opacity={0.6} sizeAttenuation />
            </points>
        </group>
    );
}

function Lighting({ glowColor = '#38bdf8' }: { glowColor?: string }) {
    return (
        <>
            <ambientLight intensity={0.55} />
            <directionalLight position={[10, 8, 5]} intensity={2.0} castShadow />
            <directionalLight position={[-8, -4, -5]} intensity={2.4} color={glowColor} />
            <pointLight position={[0, -2, 2]} intensity={1.5} color={glowColor} distance={12} />
        </>
    );
}

export default function ThreeModelViewer({
    modelUrl,
    autoRotate = false,
    glowColor = '#38bdf8',
    fov = 50,
    scaleScalar = 1,
    enableControls = true,
    compact = false,
    initialRotation = [0, 0, 0],
}: ThreeModelViewerProps) {
    const isProcedural = !modelUrl || modelUrl === 'procedural';

    // Wait two rAF ticks before revealing the canvas — by then the Model useEffect has
    // run and repositioned the camera, so there is no single-frame default-position flash.
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        let r2: number;
        const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setVisible(true)); });
        return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }, []);

    return (
        <div
            className="w-full h-full relative"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.1s ease' }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
                style={{ background: 'transparent' }}
            >
                <Lighting glowColor={glowColor} />
                <Suspense fallback={<Loader />}>
                    {isProcedural ? (
                        <HolographicFallback color={glowColor} />
                    ) : (
                        <Model
                            url={modelUrl}
                            autoRotate={autoRotate}
                            scaleScalar={scaleScalar}
                            compact={compact}
                            initialRotation={initialRotation}
                        />
                    )}
                </Suspense>
                {enableControls && (
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={autoRotate}
                        autoRotateSpeed={1.2}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 2.5}
                    />
                )}
            </Canvas>
            {enableControls && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 mono text-[8px] text-neutral-600 uppercase tracking-widest pointer-events-none text-center whitespace-nowrap">
                    Drag to rotate
                </div>
            )}
        </div>
    );
}

if (typeof window !== 'undefined') {
    useGLTF.preload('/models/millennium_falcon.glb');
    useGLTF.preload('/models/interstellar__endurance_high_fidelity.glb');
    useGLTF.preload('/models/project_hail_mary_ship.glb');
}
