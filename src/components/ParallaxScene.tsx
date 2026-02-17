'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ================================================================
   Optimised scroll-driven hero:
   Phase 0 (0 → 0.35):  Simple atom – 3 electrons orbit a nucleus
   Phase 1 (0.35 → 0.65): Atom morphs into solar system
                           – Nucleus → Sun GLTF
                           – Electron orbits expand into planet orbits
                           – Planet spheres appear
   Phase 2 (0.65 → 1.0):  Camera zooms into Mars (NASA GLTF)

   Performance notes:
   ● Only 7 mesh objects (nucleus, 3 electrons, 3 orbit rings)
     that morph into 8 orbit rings + planet spheres + Mars GLB
   ● No per-frame allocations; all arrays pre-computed
   ● Particles removed – geometry-based approach
   ================================================================ */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/* ---------- Atom nucleus → Sun glow core ---------- */
function Nucleus({ scrollProgress }: { scrollProgress: number }) {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const morph = smoothstep(clamp01((scrollProgress - 0.15) / 0.35));
        // Atom nucleus: small, bright
        // Solar: slightly larger glow
        const scale = lerp(0.18, 0.6, morph);
        ref.current.scale.setScalar(scale);
        ref.current.rotation.y = state.clock.elapsedTime * 0.3;

        const mat = ref.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = lerp(1.5, 3, morph);

        // Fade out as camera zooms into Mars
        const fade = clamp01(1 - (scrollProgress - 0.75) / 0.25);
        mat.opacity = fade;
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshStandardMaterial
                color="#ffd700"
                emissive="#ff9500"
                emissiveIntensity={1.5}
                roughness={0.3}
                transparent
            />
        </mesh>
    );
}

/* ---------- Three electrons on orbits ---------- */
function Electrons({ scrollProgress }: { scrollProgress: number }) {
    const groupRef = useRef<THREE.Group>(null);

    // 3 electrons, each on a differently-tilted orbit
    const electronData = useMemo(() => [
        { orbitR: 1.0, tiltX: 0.3, tiltZ: 0, speed: 1.8, offset: 0, targetOrbit: 4.0, color: '#60b0ff' },
        { orbitR: 1.5, tiltX: 1.05, tiltZ: 0.5, speed: 1.2, offset: 2.1, targetOrbit: 7.0, color: '#ff8080' },
        { orbitR: 2.0, tiltX: 0.6, tiltZ: -0.4, speed: 0.85, offset: 4.2, targetOrbit: 11.0, color: '#80ffa0' },
    ], []);

    // Planet orbit radii for the solar system
    const planetOrbits = useMemo(() => [2.2, 3.0, 4.0, 5.2, 7.0, 9.0, 11.0, 13.0], []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        const morph = smoothstep(clamp01((scrollProgress - 0.15) / 0.35));
        const fade = clamp01(1 - (scrollProgress - 0.75) / 0.25);

        groupRef.current.children.forEach((child, i) => {
            const ed = electronData[i];
            if (!ed) return;

            const mesh = child as THREE.Mesh;
            const angle = t * ed.speed + ed.offset;
            const currentR = lerp(ed.orbitR, ed.targetOrbit, morph);

            // Orbit tilt flattens as we go to solar system (top-down view)
            const tiltX = lerp(ed.tiltX, 0, morph);
            const tiltZ = lerp(ed.tiltZ, 0, morph);

            const x = Math.cos(angle) * currentR;
            const z = Math.sin(angle) * currentR;
            // Apply tilt rotation
            const y = z * Math.sin(tiltX) + x * Math.sin(tiltZ);
            const zFinal = z * Math.cos(tiltX);
            const xFinal = x * Math.cos(tiltZ);

            mesh.position.set(xFinal, y, zFinal);

            // Electron size grows into planet size
            const scale = lerp(0.08, 0.15, morph);
            mesh.scale.setScalar(scale);

            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.opacity = fade;
        });
    });

    return (
        <group ref={groupRef}>
            {electronData.map((ed, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial
                        color={ed.color}
                        emissive={ed.color}
                        emissiveIntensity={0.6}
                        roughness={0.4}
                        transparent
                    />
                </mesh>
            ))}
        </group>
    );
}

/* ---------- Orbit rings (3 tilted → 8 flat) ---------- */
function OrbitRings({ scrollProgress }: { scrollProgress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const morph = smoothstep(clamp01((scrollProgress - 0.15) / 0.35));
    const fade = clamp01(1 - (scrollProgress - 0.75) / 0.25);

    // 3 atom orbits expanding to 8 planet orbits
    const atomOrbits = useMemo(() => [
        { r: 1.0, tiltX: 0.3, tiltZ: 0 },
        { r: 1.5, tiltX: 1.05, tiltZ: 0.5 },
        { r: 2.0, tiltX: 0.6, tiltZ: -0.4 },
    ], []);

    const planetOrbits = useMemo(() => [2.2, 3.0, 4.0, 5.2, 7.0, 9.0, 11.0, 13.0], []);

    return (
        <group ref={groupRef}>
            {/* First 3 rings: morph from atom orbits to first 3 planet orbits */}
            {atomOrbits.map((ao, i) => {
                const targetR = planetOrbits[i] || ao.r;
                const currentR = lerp(ao.r, targetR, morph);
                const tiltX = lerp(ao.tiltX, Math.PI / 2, morph);
                const tiltZ = lerp(ao.tiltZ, 0, morph);
                const isMarsOrbit = i === 0 && morph > 0.5;
                return (
                    <mesh key={`morph-${i}`} rotation={[tiltX, 0, tiltZ]}>
                        <torusGeometry args={[currentR, 0.008, 8, 128]} />
                        <meshBasicMaterial
                            color={isMarsOrbit ? '#ff6b35' : '#999'}
                            transparent
                            opacity={lerp(0.4, 0.15, morph) * fade}
                        />
                    </mesh>
                );
            })}

            {/* Additional 5 planet orbit rings that fade in */}
            {planetOrbits.slice(3).map((r, i) => (
                <mesh key={`planet-${i}`} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[r, 0.006, 8, 128]} />
                    <meshBasicMaterial
                        color={i === 0 ? '#ff6b35' : '#888'}
                        transparent
                        opacity={clamp01((morph - 0.4) / 0.4) * 0.12 * fade}
                    />
                </mesh>
            ))}
        </group>
    );
}

/* ---------- Planet spheres (fade in on solar system phase) ---------- */
function Planets({ scrollProgress }: { scrollProgress: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const appear = smoothstep(clamp01((scrollProgress - 0.35) / 0.2));
    const fade = clamp01(1 - (scrollProgress - 0.75) / 0.25);

    const planets = useMemo(() => [
        { orbit: 2.2, size: 0.06, color: '#b0b0b0', speed: 0.47 },  // Mercury
        { orbit: 3.0, size: 0.09, color: '#e6c35c', speed: 0.35 },  // Venus
        { orbit: 4.0, size: 0.1, color: '#4a90d9', speed: 0.29 },  // Earth
        // Mars: rendered as GLTF, skip here
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

/* ---------- Sun GLTF ---------- */
function SunModel({ scrollProgress }: { scrollProgress: number }) {
    const { scene } = useGLTF('/models/sun.glb');
    const ref = useRef<THREE.Group>(null);
    const appear = smoothstep(clamp01((scrollProgress - 0.25) / 0.2));
    const fade = clamp01(1 - (scrollProgress - 0.75) / 0.25);

    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) {
                    mat.emissive = new THREE.Color('#ff9500');
                    mat.emissiveIntensity = 0.5;
                    mat.transparent = true;
                }
            }
        });
    }, [scene]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.05;
        const s = appear * 0.0014;
        ref.current.scale.setScalar(s);
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.opacity = appear * fade;
            }
        });
    });

    return <primitive ref={ref} object={scene} />;
}

/* ---------- Mars GLTF ---------- */
function MarsModel({ scrollProgress }: { scrollProgress: number }) {
    const { scene } = useGLTF('/models/mars.glb');
    const ref = useRef<THREE.Group>(null);
    const marsAppear = smoothstep(clamp01((scrollProgress - 0.5) / 0.3));

    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.transparent = true;
            }
        });
    }, [scene]);

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.y = state.clock.elapsedTime * 0.08;

        // Start on orbit, move to centre as zoom progresses
        const orbitAngle = state.clock.elapsedTime * 0.22;
        const orbitR = 5.2;
        const ox = Math.cos(orbitAngle) * orbitR * (1 - marsAppear);
        const oz = Math.sin(orbitAngle) * orbitR * (1 - marsAppear);

        ref.current.position.set(ox, 0, oz);

        const orbitScale = 0.0003;
        const zoomedScale = 0.0022;
        ref.current.scale.setScalar(lerp(orbitScale, zoomedScale, marsAppear));

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.opacity = clamp01(marsAppear * 2.5);
            }
        });
    });

    return (
        <group ref={ref} rotation={[Math.PI / 6, 0, 0]}>
            <primitive object={scene} />
        </group>
    );
}

/* ---------- Camera ---------- */
function CameraController({ scrollProgress }: { scrollProgress: number }) {
    const { camera } = useThree();

    useFrame(() => {
        // Phase 0: close to atom (z ≈ 5)
        // Phase 1: pull back for solar system (z ≈ 22, y ≈ 10)
        // Phase 2: zoom into Mars (z ≈ 2)
        const p1 = smoothstep(clamp01(scrollProgress / 0.35));
        const p2 = smoothstep(clamp01((scrollProgress - 0.65) / 0.35));

        const z = lerp(5, 22, p1) - p2 * 20;
        const y = p1 * 10 - p2 * 9;
        camera.position.set(0, Math.max(y, 0.2), Math.max(z, 1.8));
        camera.lookAt(0, 0, 0);
    });

    return null;
}

/* ---------- Scene ---------- */
function SceneContent({ scrollProgress }: { scrollProgress: number }) {
    return (
        <>
            <ambientLight intensity={0.35} />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffd700" distance={30} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />

            <CameraController scrollProgress={scrollProgress} />
            <Nucleus scrollProgress={scrollProgress} />
            <Electrons scrollProgress={scrollProgress} />
            <OrbitRings scrollProgress={scrollProgress} />
            <Planets scrollProgress={scrollProgress} />

            <Suspense fallback={null}>
                <SunModel scrollProgress={scrollProgress} />
                <MarsModel scrollProgress={scrollProgress} />
            </Suspense>
        </>
    );
}

interface HeroSceneProps {
    scrollProgress: number;
}

export default function HeroScene({ scrollProgress }: HeroSceneProps) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 55 }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            frameloop="always"
        >
            <SceneContent scrollProgress={scrollProgress} />
        </Canvas>
    );
}

useGLTF.preload('/models/sun.glb');
useGLTF.preload('/models/mars.glb');
