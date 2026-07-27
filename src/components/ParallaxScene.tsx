'use client';

import { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ================================================================
   Scroll-driven Mars research scene:
   - SOLAR: Sun GLB, procedural planets, Mars zooms to center.
   The sequence starts as soon as the section's top reaches the
   middle of the screen, so it bleeds up into the section above.
   - CAMERA: Zoom logic (Phase 0 → Phase 1 → Phase 2).
   Progress is measured from the scene container's own position in
   the page, so the scene can sit anywhere in the scroll flow.
   All components read a scrollRef directly in useFrame — zero React
   re-renders from scroll events.
   ================================================================ */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

const cityUrl = '/models/mars.glb';
const sunUrl = '/models/sun.glb';

type ScrollRef = React.RefObject<number>;

// ─── SOLAR SYSTEM ─────────────────────────────────────────────────

type PlanetDef = { orbit: number; size: number; color: string; speed: number };

function Planets({ scrollRef }: { scrollRef: ScrollRef }) {
    const groupRef = useRef<THREE.Group>(null);
    const matRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
    const ringMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

    const planets = useMemo<PlanetDef[]>(() => [
        { orbit: 2.2,  size: 0.06, color: '#b0b0b0', speed: 0.47  }, // Mercury
        { orbit: 3.0,  size: 0.09, color: '#e6c35c', speed: 0.35  }, // Venus
        { orbit: 4.0,  size: 0.1,  color: '#4a90d9', speed: 0.29  }, // Earth
        { orbit: 7.0,  size: 0.5,  color: '#d4a96a', speed: 0.13  }, // Jupiter
        { orbit: 9.0,  size: 0.2,  color: '#e8d08a', speed: 0.09  }, // Saturn
        { orbit: 11.0, size: 0.13, color: '#7bc8e0', speed: 0.064 }, // Uranus
        { orbit: 13.0, size: 0.12, color: '#4169e1', speed: 0.05  }, // Neptune
    ], []);

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        const sp = scrollRef.current;
        const appear = smoothstep(clamp01((sp - 0.05) / 0.15));
        const fade = clamp01(1 - (sp - 0.70) / 0.20);
        const opacity = appear * fade;

        groupRef.current.children.forEach((child, i) => {
            const p = planets[i];
            if (!p) return;
            const angle = t * p.speed + i * 1.5;
            child.position.set(Math.cos(angle) * p.orbit, 0, Math.sin(angle) * p.orbit);
        });

        matRefs.current.forEach(m => { if (m) m.opacity = opacity; });
        if (ringMatRef.current) ringMatRef.current.opacity = opacity * 0.4;
    });

    return (
        <group ref={groupRef} rotation={[Math.PI / 6, 0, 0]}>
            {planets.map((p, i) => (
                <group key={i}>
                    <mesh>
                        <sphereGeometry args={[p.size, 16, 16]} />
                        <meshStandardMaterial
                            ref={(el: THREE.MeshStandardMaterial | null) => { matRefs.current[i] = el; }}
                            color={p.color}
                            roughness={0.7}
                            transparent
                            opacity={0}
                        />
                    </mesh>
                    {i === 4 && (
                        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                            <ringGeometry args={[p.size * 2.0, p.size * 1.5, 48]} />
                            <meshStandardMaterial
                                ref={(el: THREE.MeshStandardMaterial | null) => { ringMatRef.current = el; }}
                                color="#c4a45a"
                                side={THREE.DoubleSide}
                                transparent
                                opacity={0}
                                roughness={0.6}
                            />
                        </mesh>
                    )}
                </group>
            ))}
        </group>
    );
}

function SunModel({ scrollRef }: { scrollRef: ScrollRef }) {
    const { scene } = useGLTF(sunUrl);
    const ref = useRef<THREE.Group>(null);

    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.renderOrder = 1;
                const createSunMat = (original: THREE.Material) => {
                    const orig = original as THREE.MeshStandardMaterial;
                    const tex = orig.map || orig.emissiveMap || null;
                    const mat = new THREE.MeshBasicMaterial({
                        color: new THREE.Color('#FDB813'),
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                    });
                    if (tex) mat.map = tex;
                    return mat;
                };
                if (mesh.material) {
                    mesh.material = Array.isArray(mesh.material)
                        ? mesh.material.map(createSunMat)
                        : createSunMat(mesh.material);
                }
            }
        });
    }, [scene]);

    useFrame(() => {
        if (!ref.current) return;
        const sp = scrollRef.current ?? 0;
        const appear = smoothstep(clamp01(sp / 0.15));
        const fade = clamp01(1 - (sp - 0.70) / 0.20);
        ref.current.scale.setScalar(appear * 0.005);
        ref.current.rotation.y += 0.002;
        const opacity = appear * fade;
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material;
                if (mat) {
                    if (Array.isArray(mat)) mat.forEach(m => { m.opacity = opacity; });
                    else (mat as THREE.Material).opacity = opacity;
                }
            }
        });
    });

    return <group ref={ref}><primitive object={scene} /></group>;
}

function MarsModel({ scrollRef }: { scrollRef: ScrollRef }) {
    const { scene } = useGLTF(cityUrl);
    const ref = useRef<THREE.Group>(null);

    useMemo(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.renderOrder = 10;
                const mat = mesh.material as THREE.MeshStandardMaterial;
                if (mat) mat.transparent = true;
            }
        });
    }, [scene]);

    useFrame((state) => {
        if (!ref.current) return;
        const sp = scrollRef.current ?? 0;
        const marsVisible = smoothstep(clamp01((sp - 0.02) / 0.15));
        const marsZoom = smoothstep(clamp01((sp - 0.25) / 0.35));

        ref.current.rotation.y = state.clock.elapsedTime * 0.08;
        const orbitAngle = state.clock.elapsedTime * 0.22;
        const orbitR = 5.2;
        ref.current.position.set(
            Math.cos(orbitAngle) * orbitR * (1 - marsZoom),
            0,
            Math.sin(orbitAngle) * orbitR * (1 - marsZoom),
        );
        ref.current.scale.setScalar(lerp(0.0003, 0.0022, marsZoom));
        const opacity = clamp01(marsVisible * 2.5);
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) mat.opacity = opacity;
            }
        });
    });

    return <group ref={ref} rotation={[Math.PI / 6, 0, 0]}><primitive object={scene} /></group>;
}

function CameraController({ scrollRef }: { scrollRef: ScrollRef }) {
    const { camera } = useThree();
    useFrame(() => {
        const sp = scrollRef.current;
        const p1 = smoothstep(clamp01(sp / 0.25));
        const p2 = smoothstep(clamp01((sp - 0.30) / 0.35));
        const z = lerp(5, 22, p1) - p2 * 20;
        const y = p1 * 10 - p2 * 9;
        camera.position.set(0, Math.max(y, 0.2), Math.max(z, 1.8));
        camera.lookAt(0, 0, 0);
    });
    return null;
}

function SceneContent({ scrollRef }: { scrollRef: ScrollRef }) {
    return (
        <>
            <ambientLight intensity={0.35} />
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffd700" distance={30} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <CameraController scrollRef={scrollRef} />
            <Planets scrollRef={scrollRef} />
            <Suspense fallback={null}>
                <SunModel scrollRef={scrollRef} />
            </Suspense>
            <Suspense fallback={null}>
                <MarsModel scrollRef={scrollRef} />
            </Suspense>
        </>
    );
}

export default function ParallaxScene() {
    const scrollRef = useRef<number>(0);

    // Own scroll listener — no React state, no re-renders.
    // Progress is 0 when the scene section's top reaches the viewport top,
    // and 1 once its last screenful has scrolled past.
    useEffect(() => {
        const container = document.getElementById('tab-content-home');
        const section = document.getElementById('mars-scene');
        if (!container || !section) return;
        const onScroll = () => {
            const rect = section.getBoundingClientRect();
            // Start the moment the section's top reaches mid-screen
            const lead = container.clientHeight * 0.5;
            const travel = rect.height - lead;
            const passed = container.getBoundingClientRect().top + lead - rect.top;
            scrollRef.current = Math.min(1, Math.max(0, passed / Math.max(1, travel)));
        };
        container.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => container.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 55 }}
            style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 1,
            }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.2,
            }}
            dpr={[1, 1.5]}
        >
            <SceneContent scrollRef={scrollRef} />
            <EffectComposer>
                <Bloom intensity={1.8} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
            </EffectComposer>
        </Canvas>
    );
}

useGLTF.preload(cityUrl);
useGLTF.preload(sunUrl);
