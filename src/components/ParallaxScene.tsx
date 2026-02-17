'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/* ================================================================
   Optimised scroll-driven hero:
   - ATOM: Right Side (x=2.5), Small, 2 Rings, 3 Electrons (2+1), Equation on Nucleus.
   - SOLAR: Procedural Sun (Fixed "Missing" issue), Planets, Mars Center Logic.
   - CAMERA: Zoom Logic (Phase 0 -> Phase 1 -> Phase 2).
   ================================================================ */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

const cityUrl = '/models/mars.glb';
const sunUrl = '/models/sun.glb';

// --- ATOM GROUP (Right Side, Small, Equation on Nucleus) ---
function AtomGroup({ progress }: { progress: number }) {
    const ref = useRef<THREE.Group>(null);
    const { viewport } = useThree();
    const isMobile = viewport.width < 6;

    const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#9b9b9bff', side: THREE.DoubleSide }), []);
    const nucleusMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#aaa0a0ff', roughness: 0.3 }), []);

    useFrame(() => {
        // Fade out as Sun appears (0.25)
        const fadeT = smoothstep(clamp01((progress - 0.15) / 0.2));
        if (ref.current) {
            const baseScale = isMobile ? 0.5 : 0.7;
            const scale = lerp(baseScale, 0, fadeT);
            ref.current.scale.setScalar(scale);
            ref.current.visible = fadeT < 1;
        }
    });

    return (
        // Positioned on Right Side (x=3) for Phase 0, or Center for mobile
        <group ref={ref} position={isMobile ? [0, 1.3, 0] : [3, 0, 0]} rotation={isMobile ? [0, 0, 0] : [0, 0, 0]}>
            {/* Nucleus */}
            <Sphere args={[0.5, isMobile ? 32 : 0, 32]} material={nucleusMat}>
                {/* Equation Centered on Nucleus */}

                <Html position={[0, 0, 0]} center transform style={{ pointerEvents: 'none' }}>
                    <div className="font-serif text-white text-[4px] font-bold tracking-widest opacity-70 whitespace-nowrap">
                        iℏ∂ψ/∂t=Ĥψ
                    </div>
                </Html>
            </Sphere>

            {/* Ring 1: 2 Electrons */}
            <group rotation={[Math.PI / 3, 0, 0]}>
                <mesh>
                    <ringGeometry args={[1.785, 1.815, 64]} />
                    <primitive object={material} />
                </mesh>
                <Selectron angleOffset={0} radius={1.8} speed={0.5} />
                <Selectron angleOffset={Math.PI} radius={1.8} speed={0.7} />
            </group>

            {/* Ring 2: 1 Electron */}
            <group rotation={[-Math.PI / 8, 0, 0]}>
                <mesh>
                    <ringGeometry args={[1.785, 1.815, 64]} />
                    <primitive object={material} />
                </mesh>
                <Selectron angleOffset={1} radius={1.8} speed={0.8} />
            </group>
        </group>
    );
}

function Selectron({ radius, speed, angleOffset }: any) {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.elapsedTime * speed + angleOffset;
            ref.current.position.x = Math.cos(t) * radius;
            ref.current.position.y = Math.sin(t) * radius;
        }
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#beb3b3ff" />
        </mesh>
    );
}

// --- SOLAR SYSTEM ---

function Planets({ scrollProgress }: { scrollProgress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const appear = smoothstep(clamp01((scrollProgress - 0.20) / 0.2));
    const fade = clamp01(1 - (scrollProgress - 0.70) / 0.20);

    const planets = useMemo(() => [
        { orbit: 2.2, size: 0.06, color: '#b0b0b0', speed: 0.47 },  // Mercury
        { orbit: 3.0, size: 0.09, color: '#e6c35c', speed: 0.35 },  // Venus
        { orbit: 4.0, size: 0.1, color: '#4a90d9', speed: 0.29 },  // Earth
        { orbit: 7.0, size: 0.2, color: '#d4a96a', speed: 0.13 },  // Jupiter
        { orbit: 9.0, size: 0.18, color: '#e8d08a', speed: 0.09 },  // Saturn
        { orbit: 11.0, size: 0.13, color: '#7bc8e0', speed: 0.064 }, // Uranus
        { orbit: 13.0, size: 0.12, color: '#4169e1', speed: 0.05 },  // Neptune
    ], []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.children.forEach((child, i) => {
            const p = planets[i];
            if (!p) return;
            const angle = t * p.speed + i * 1.5;
            child.position.set(
                Math.cos(angle) * p.orbit,
                0,
                Math.sin(angle) * p.orbit,
            );
        });
    });

    return (
        <group ref={groupRef} rotation={[Math.PI / 6, 0, 0]}>
            {planets.map((p, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[p.size, 16, 16]} />
                    <meshStandardMaterial
                        color={p.color}
                        roughness={0.7}
                        transparent
                        opacity={appear * fade}
                    />
                </mesh>
            ))}
        </group>
    );
}

// --- PROCEDURAL SUN (Fixes "Missing Sun" Issue) ---
// --- GLTF SUN MODEL ---
function SunModel({ scrollProgress }: { scrollProgress: number }) {
    const { scene } = useGLTF(sunUrl);
    const ref = useRef<THREE.Group>(null);
    const appear = smoothstep(clamp01((scrollProgress - 0.20) / 0.2));
    const fade = clamp01(1 - (scrollProgress - 0.70) / 0.20);

    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.renderOrder = 1; // Render early

                // Helper to create glowing yellow material
                const createSunMat = (original: THREE.Material) => {
                    const newMat = new THREE.MeshBasicMaterial({
                        color: new THREE.Color("#FDB813"), // Force Yellow
                        transparent: true,
                    });
                    // Preserve texture if exists
                    if ('map' in original) {
                        newMat.map = (original as THREE.MeshStandardMaterial).map;
                    }
                    return newMat;
                };

                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material = mesh.material.map(createSunMat);
                    } else {
                        mesh.material = createSunMat(mesh.material);
                    }
                }
            }
        });
    }, [scene]);

    useFrame(() => {
        if (!ref.current) return;
        // Adjust scale factor if model is too big/small. Starting with 1.8.
        const s = appear * 1.8;
        ref.current.scale.setScalar(s);
        ref.current.rotation.y += 0.002;

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const material = (child as THREE.Mesh).material;
                if (material) {
                    if (Array.isArray(material)) {
                        material.forEach(m => (m.opacity = appear * fade));
                    } else {
                        material.opacity = appear * fade;
                    }
                }
            }
        });
    });

    return (
        <group ref={ref}>
            <primitive object={scene} />
        </group>
    );
}

function MarsModel({ scrollProgress }: { scrollProgress: number }) {
    const { scene } = useGLTF(cityUrl);
    const ref = useRef<THREE.Group>(null);

    // Split Visibility and Zoom Logic
    // 1. Visible: Appear with other planets (0.25)
    // 2. Zoom: Move to center and scale up (starts at 0.45)
    const marsVisible = smoothstep(clamp01((scrollProgress - 0.25) / 0.2));
    const marsZoom = smoothstep(clamp01((scrollProgress - 0.45) / 0.3));

    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.renderOrder = 10; // Mars ALWAYS on top of Sun
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.transparent = true;
            }
        });
    }, [scene]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.08;

        const orbitAngle = state.clock.elapsedTime * 0.22;
        const orbitR = 5.2;

        // Position: 
        // Initially in Orbit (marsZoom = 0).
        // As marsZoom -> 1, moves to Center (0,0,0).
        const ox = Math.cos(orbitAngle) * orbitR * (1 - marsZoom);
        const oz = Math.sin(orbitAngle) * orbitR * (1 - marsZoom);

        ref.current.position.set(ox, 0, oz);

        // Scale:
        // Small in orbit, Large in center
        const orbitScale = 0.0003;
        const zoomedScale = 0.0022;
        ref.current.scale.setScalar(lerp(orbitScale, zoomedScale, marsZoom));

        // Opacity controlled by marsVisible (Early) NOT marsZoom
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.opacity = clamp01(marsVisible * 2.5);
            }
        });
    });

    return (
        <group ref={ref} rotation={[Math.PI / 6, 0, 0]}>
            <primitive object={scene} />
        </group>
    );
}

function CameraController({ scrollProgress }: { scrollProgress: number }) {
    const { camera } = useThree();

    useFrame(() => {
        const p1 = smoothstep(clamp01(scrollProgress / 0.30));
        const p2 = smoothstep(clamp01((scrollProgress - 0.45) / 0.30));

        const z = lerp(5, 22, p1) - p2 * 20;
        const y = p1 * 10 - p2 * 9;

        camera.position.set(0, Math.max(y, 0.2), Math.max(z, 1.8));
        camera.lookAt(0, 0, 0);
    });

    return null;
}

function SceneContent({ scrollProgress }: { scrollProgress: number }) {
    return (
        <>
            <ambientLight intensity={0.35} />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffd700" distance={30} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />

            <CameraController scrollProgress={scrollProgress} />

            <AtomGroup progress={scrollProgress} />
            <Planets scrollProgress={scrollProgress} />

            <Suspense fallback={null}>
                <SunModel scrollProgress={scrollProgress} />
            </Suspense>
            <Suspense fallback={null}>
                <MarsModel scrollProgress={scrollProgress} />
            </Suspense>
        </>
    );
}

export default function ParallaxScene({ scrollProgress }: { scrollProgress: number }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 55 }}
            style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 1
            }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
        >
            <SceneContent scrollProgress={scrollProgress} />
        </Canvas>
    );
}

useGLTF.preload(cityUrl);
useGLTF.preload(sunUrl);
