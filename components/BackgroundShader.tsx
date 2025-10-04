'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface TriangleData {
  finalPosition: THREE.Vector3;
  offset: THREE.Vector3;
  rotation: number;
  delay: number;
  uvs: THREE.Vector2[];
}

function TriangularMesh({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, '/background.png');

  // Generate triangular pieces
  const triangles = useMemo<TriangleData[]>(() => {
    const pieces: TriangleData[] = [];
    const gridSize = 25; // More pieces for finer detail
    const aspectRatio = 3 / 4; // Portrait aspect ratio (container is 3:4)
    const width = 2;
    const height = width / aspectRatio; // This creates a 2 x 2.667 mesh

    // Create a grid and divide into triangles
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = (col / gridSize - 0.5) * width;
        const y = (row / gridSize - 0.5) * height;
        const w = width / gridSize;
        const h = height / gridSize;

        const uv_x = col / gridSize;
        const uv_y = row / gridSize; // Correct orientation
        const uv_w = 1 / gridSize;
        const uv_h = 1 / gridSize;

        // Center position of this cell
        const centerX = x + w / 2;
        const centerY = y + h / 2;

        // Create two triangles per grid cell
        // Triangle 1 (top-left)
        pieces.push({
          finalPosition: new THREE.Vector3(centerX, centerY, 0),
          offset: new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 3
          ),
          rotation: (Math.random() - 0.5) * Math.PI * 4,
          delay: Math.random() * 0.3,
          uvs: [
            new THREE.Vector2(uv_x, uv_y),
            new THREE.Vector2(uv_x + uv_w, uv_y),
            new THREE.Vector2(uv_x, uv_y + uv_h),
          ],
        });

        // Triangle 2 (bottom-right)
        pieces.push({
          finalPosition: new THREE.Vector3(centerX, centerY, 0),
          offset: new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 3
          ),
          rotation: (Math.random() - 0.5) * Math.PI * 4,
          delay: Math.random() * 0.3,
          uvs: [
            new THREE.Vector2(uv_x + uv_w, uv_y),
            new THREE.Vector2(uv_x + uv_w, uv_y + uv_h),
            new THREE.Vector2(uv_x, uv_y + uv_h),
          ],
        });
      }
    }

    return pieces;
  }, []);

  // Create meshes for each triangle
  const triangleMeshes = useMemo(() => {
    const gridSize = 25;
    const aspectRatio = 3 / 4;
    const width = 2;
    const height = width / aspectRatio;
    const w = width / gridSize;
    const h = height / gridSize;

    // Create geometry centered at origin
    const triGeometry1 = new THREE.BufferGeometry();
    const vertices1 = new Float32Array([
      -w / 2, -h / 2, 0,
      w / 2, -h / 2, 0,
      -w / 2, h / 2, 0,
    ]);
    triGeometry1.setAttribute('position', new THREE.BufferAttribute(vertices1, 3));

    const triGeometry2 = new THREE.BufferGeometry();
    const vertices2 = new Float32Array([
      w / 2, -h / 2, 0,
      w / 2, h / 2, 0,
      -w / 2, h / 2, 0,
    ]);
    triGeometry2.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));

    return triangles.map((triangle, index) => {
      // Alternate between two triangle orientations
      const geometry = (index % 2 === 0 ? triGeometry1 : triGeometry2).clone();

      // Set UVs for this specific triangle
      const uvs = new Float32Array(6);
      triangle.uvs.forEach((uv, i) => {
        uvs[i * 2] = uv.x;
        uvs[i * 2 + 1] = uv.y;
      });
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

      // Create unique material instance for each triangle
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });

      return {
        geometry,
        material,
        triangle,
      };
    });
  }, [triangles, texture]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((mesh, index) => {
        const data = triangleMeshes[index];
        const triangle = data.triangle;

        // Calculate animation progress for this piece with delay
        const pieceProgress = Math.max(0, Math.min(1, (scrollProgress - triangle.delay) / (1 - triangle.delay)));

        // Easing function (ease-out quartic): starts fast, slows down at the end
        const eased = 1 - Math.pow(1 - pieceProgress, 4);

        // Interpolate position from offset to final position
        const startPos = new THREE.Vector3().copy(triangle.finalPosition).add(triangle.offset);
        mesh.position.lerpVectors(startPos, triangle.finalPosition, eased);

        // Interpolate rotation
        mesh.rotation.z = triangle.rotation * (1 - eased);

        // Fade in opacity from 0 to 100%
        (mesh as THREE.Mesh).material.opacity = Math.min(1, eased);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {triangleMeshes.map((data, index) => (
        <mesh key={index} geometry={data.geometry} material={data.material} />
      ))}
    </group>
  );
}

export default function BackgroundShader({ scrollProgress }: { scrollProgress: number }) {
  return (
    <div className="absolute inset-0 z-0 bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <TriangularMesh scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
