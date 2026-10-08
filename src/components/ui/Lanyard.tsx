/* eslint-disable react/no-unknown-property */
'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes('THREE.Clock: This module has been deprecated') ||
      msg.includes('using deprecated parameters for the initialization function') ||
      msg.includes('THREE.WebGLProgram: Program Info Log')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const DEFAULT_CARD_GLB = '/assets/lanyard/card.glb';
const DEFAULT_LANYARD_PNG = '/assets/lanyard/lanyard.png';

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  className?: string;
  cardModel?: string;
  flipTrigger?: number;
}

export function Lanyard({
  position = [0, 0, 15],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  className = '',
  cardModel = DEFAULT_CARD_GLB,
  flipTrigger = 0
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  if (!mounted) {
    return (
      <div className={`relative z-0 w-full flex justify-center items-center ${className || 'h-[440px] md:h-[560px]'}`}>
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const cameraPosition: [number, number, number] = [
    position[0],
    position[1],
    isMobile ? position[2] + 0.8 : position[2]
  ];

  return (
    <div ref={wrapRef} className={`relative z-0 w-full flex justify-center items-center transform scale-100 origin-center ${className || 'h-[440px] md:h-[560px]'}`}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: cameraPosition, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        style={{ touchAction: 'pan-y' }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={1 / 60} paused={!visible}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              cardModel={cardModel}
              flipTrigger={flipTrigger}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  cardModel?: string;
  flipTrigger?: number;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  cardModel = DEFAULT_CARD_GLB,
  flipTrigger = 0
}: BandProps) {
  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<LanyardRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const cardGroup = useRef<THREE.Group>(null!);

  const isFlippedRef = useRef(false);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const prevFlipTrigger = useRef(flipTrigger);

  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastPointerX = useRef(0);
  const pointerVelX = useRef(0);
  const isDragMoved = useRef(false);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const cardHook = useMemo(() => new THREE.Vector3(), []);
  const rotQuat = useMemo(() => new THREE.Quaternion(), []);

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      const trans = body.translation();
      if (trans && !isNaN(trans.x)) {
        body.lerped = new THREE.Vector3().copy(trans as any);
      } else {
        body.lerped = new THREE.Vector3();
      }
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardModel) as any;
  const texture = useTexture(lanyardImage || DEFAULT_LANYARD_PNG);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Prevent physics body from rotating around Y axis in Rapier
  useEffect(() => {
    if (card.current) {
      try {
        (card.current as any).setEnabledRotations?.(true, false, true, true);
      } catch {}
    }
  }, []);

  // Trigger persistent 180-degree flip when flipTrigger changes
  useEffect(() => {
    if (flipTrigger !== prevFlipTrigger.current) {
      prevFlipTrigger.current = flipTrigger;
      targetAngleRef.current = Math.round(currentAngleRef.current / Math.PI) * Math.PI + Math.PI;
      isFlippedRef.current = Math.abs(Math.round(targetAngleRef.current / Math.PI)) % 2 === 1;
      drag(false);
      isDragMoved.current = false;
      if (card.current) {
        card.current.wakeUp();
        card.current.applyImpulse({ x: 0, y: 0.3, z: 0.1 }, true);
      }
    }
  }, [flipTrigger]);

  // Ensure any global pointer release/cancel snaps to nearest neat face (0 or 180 degrees)
  useEffect(() => {
    const handleGlobalRelease = () => {
      drag(false);
      isDragMoved.current = false;
      targetAngleRef.current = Math.round(currentAngleRef.current / Math.PI) * Math.PI;
      isFlippedRef.current = Math.abs(Math.round(targetAngleRef.current / Math.PI)) % 2 === 1;
    };
    window.addEventListener('pointerup', handleGlobalRelease);
    window.addEventListener('pointercancel', handleGlobalRelease);
    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('pointercancel', handleGlobalRelease);
    };
  }, []);

  const cardMap = useMemo(() => {
    const baseMap = materials?.base?.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap?.image as any;
    if (!baseImg) return baseMap;

    const W = baseImg.width || 1024;
    const H = baseImg.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: any, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials?.base?.map]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, -0.05]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });

      // Calculate horizontal drag to swivel card around Y while dragging
      const currentClientX = (state.pointer.x + 1) * 0.5 * (typeof window !== 'undefined' ? window.innerWidth : 1000);
      const dx = currentClientX - lastPointerX.current;
      lastPointerX.current = currentClientX;
      pointerVelX.current = dx / Math.max(delta, 0.001);

      if (Math.abs(currentClientX - dragStartPos.current.x) > 5) {
        isDragMoved.current = true;
      }

      currentAngleRef.current += dx * 0.015;
    }

    // Smoothly rotate the visual card towards the target face (exact multiple of Math.PI so it NEVER stops sideways)
    if (!dragged) {
      const diff = targetAngleRef.current - currentAngleRef.current;
      currentAngleRef.current += diff * Math.min(1, delta * 12);
    }

    if (cardGroup.current) {
      cardGroup.current.rotation.y = currentAngleRef.current;
    }

    if (fixed.current) {
      [j1, j2, j3].forEach(ref => {
        if (!ref.current) return;
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });

      // Compute exact position of the hook/clip eyelet on the card in world space
      if (card.current) {
        const cTrans = card.current.translation();
        const cRot = card.current.rotation();
        rotQuat.set(cRot.x, cRot.y, cRot.z, cRot.w);
        // Anchor the ribbon end right into the clip eyelet on the card
        cardHook.set(0, 1.44, -0.05).applyQuaternion(rotQuat).add(vec.set(cTrans.x, cTrans.y, cTrans.z));
      } else if (j3.current) {
        cardHook.copy(getLerped(j3.current));
      }

      const j1Trans = getLerped(j1.current);
      const j2Trans = getLerped(j2.current);
      const fixedTrans = fixed.current.translation();
      
      if (
        !isNaN(cardHook.x) &&
        !isNaN(j2Trans.x) &&
        !isNaN(j1Trans.x) &&
        fixedTrans && !isNaN(fixedTrans.x)
      ) {
        curve.points[0].copy(cardHook);
        curve.points[1].copy(j2Trans);
        curve.points[2].copy(j1Trans);
        curve.points[3].copy(fixedTrans as any);
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      if (band.current?.material) {
        (band.current.material as any).resolution.set(state.size.width, state.size.height);
      }

      if (card.current) {
        ang.copy(card.current.angvel());
        // Zero out angular velocity around Y so the physics body doesn't twist sideways
        card.current.setAngvel({
          x: ang.x * 0.95,
          y: 0,
          z: ang.z * 0.95
        }, true);
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={cardGroup}
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              try {
                (e.nativeEvent?.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
              } catch {}

              const clientX = (e.nativeEvent as PointerEvent)?.clientX ?? e.clientX;
              const clientY = (e.nativeEvent as PointerEvent)?.clientY ?? e.clientY;
              const moveDist = Math.hypot(
                clientX - dragStartPos.current.x,
                clientY - dragStartPos.current.y
              );

              drag(false);

              if (moveDist < 12 && !isDragMoved.current) {
                // Direct click/tap on the card: flip to the other side persistently!
                targetAngleRef.current = Math.round(currentAngleRef.current / Math.PI) * Math.PI + Math.PI;
                isFlippedRef.current = Math.abs(Math.round(targetAngleRef.current / Math.PI)) % 2 === 1;
                if (card.current) {
                  card.current.wakeUp();
                  card.current.applyImpulse({ x: 0, y: 0.3, z: 0.1 }, true);
                }
              } else {
                // Released after dragging: snap to whichever face it is closer to!
                targetAngleRef.current = Math.round(currentAngleRef.current / Math.PI) * Math.PI;
                isFlippedRef.current = Math.abs(Math.round(targetAngleRef.current / Math.PI)) % 2 === 1;
              }
            }}
            onPointerCancel={(e: ThreeEvent<PointerEvent>) => {
              try {
                (e.nativeEvent?.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
              } catch {}
              drag(false);
              isDragMoved.current = false;
              targetAngleRef.current = Math.round(currentAngleRef.current / Math.PI) * Math.PI;
              isFlippedRef.current = Math.abs(Math.round(targetAngleRef.current / Math.PI)) % 2 === 1;
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              try {
                (e.nativeEvent?.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
              } catch {}
              const clientX = (e.nativeEvent as PointerEvent)?.clientX ?? e.clientX;
              const clientY = (e.nativeEvent as PointerEvent)?.clientY ?? e.clientY;
              dragStartPos.current = { x: clientX, y: clientY };
              lastPointerX.current = clientX;
              pointerVelX.current = 0;
              isDragMoved.current = false;
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
    </>
  );
}

export default Lanyard;
