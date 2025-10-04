'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import Delaunator from 'delaunator';

interface TriangleData {
  finalPosition: THREE.Vector3;
  offset: THREE.Vector3;
  rotation: number;
  delay: number;
  uvs: THREE.Vector2[];
  velocity: THREE.Vector3;
  prevPosition: THREE.Vector3;
}

function TriangularMesh({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(TextureLoader, '/background.png');

  // Generate triangular pieces using Delaunay triangulation
  const triangles = useMemo<TriangleData[]>(() => {
    const pieces: TriangleData[] = [];
    const aspectRatio = 3 / 4; // Portrait aspect ratio (container is 3:4)
    const width = 2;
    const height = width / aspectRatio; // This creates a 2 x 2.667 mesh

    // Generate random points for Delaunay triangulation
    const numPoints = 300; // Adjust for density of triangulation
    const points: number[] = [];

    // Add corner points to ensure full coverage
    points.push(-width/2, -height/2);
    points.push(width/2, -height/2);
    points.push(width/2, height/2);
    points.push(-width/2, height/2);

    // Add random interior points
    for (let i = 0; i < numPoints; i++) {
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      points.push(x, y);
    }

    // Perform Delaunay triangulation
    const delaunay = new Delaunator(points);

    // Convert triangulation to our triangle format
    for (let i = 0; i < delaunay.triangles.length; i += 3) {
      const i0 = delaunay.triangles[i] * 2;
      const i1 = delaunay.triangles[i + 1] * 2;
      const i2 = delaunay.triangles[i + 2] * 2;

      const p0 = new THREE.Vector2(points[i0], points[i0 + 1]);
      const p1 = new THREE.Vector2(points[i1], points[i1 + 1]);
      const p2 = new THREE.Vector2(points[i2], points[i2 + 1]);

      // Calculate centroid for final position
      const centerX = (p0.x + p1.x + p2.x) / 3;
      const centerY = (p0.y + p1.y + p2.y) / 3;

      // Convert world coordinates to UV coordinates (0-1 range)
      const uv0 = new THREE.Vector2((p0.x / width) + 0.5, (p0.y / height) + 0.5);
      const uv1 = new THREE.Vector2((p1.x / width) + 0.5, (p1.y / height) + 0.5);
      const uv2 = new THREE.Vector2((p2.x / width) + 0.5, (p2.y / height) + 0.5);

      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3
      );
      const startPos = new THREE.Vector3(centerX, centerY, 0).add(offset);

      pieces.push({
        finalPosition: new THREE.Vector3(centerX, centerY, 0),
        offset: offset,
        rotation: (Math.random() - 0.5) * Math.PI * 4,
        delay: Math.random() * 0.3,
        uvs: [uv0, uv1, uv2],
        velocity: new THREE.Vector3(0, 0, 0),
        prevPosition: startPos.clone(),
      });
    }

    return pieces;
  }, []);

  // Create meshes for each triangle based on Delaunay triangulation
  const triangleMeshes = useMemo(() => {
    const aspectRatio = 3 / 4;
    const width = 2;
    const height = width / aspectRatio;

    // Custom shader for motion blur effect
    const motionBlurShader = {
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        uniform vec3 velocity;
        varying vec2 vUv;

        void main() {
          vec4 color = vec4(0.0);
          float velocityMag = length(velocity);
          float samples = 8.0;

          // Only apply blur if velocity is significant
          if (velocityMag > 0.001) {
            float blurStrength = min(velocityMag * 0.01, 0.05); // Cap blur strength
            vec2 blurDir = normalize(velocity.xy);

            // Sample along the motion direction for blur effect
            for (float i = 0.0; i < samples; i++) {
              float offset = (i / (samples - 1.0) - 0.5) * blurStrength;
              vec2 sampleUV = clamp(vUv - blurDir * offset, 0.0, 1.0);
              color += texture2D(map, sampleUV);
            }
            color /= samples;
          } else {
            // No blur when stationary - just sample the texture directly
            color = texture2D(map, vUv);
          }

          color.a *= opacity;
          gl_FragColor = color;
        }
      `,
    };

    return triangles.map((triangle) => {
      // Calculate relative positions from the centroid
      const geometry = new THREE.BufferGeometry();

      // Get the actual vertex positions relative to the centroid
      const uv0 = triangle.uvs[0];
      const uv1 = triangle.uvs[1];
      const uv2 = triangle.uvs[2];

      // Convert UV coordinates back to world coordinates (relative to centroid)
      const x0 = (uv0.x - 0.5) * width - triangle.finalPosition.x;
      const y0 = (uv0.y - 0.5) * height - triangle.finalPosition.y;
      const x1 = (uv1.x - 0.5) * width - triangle.finalPosition.x;
      const y1 = (uv1.y - 0.5) * height - triangle.finalPosition.y;
      const x2 = (uv2.x - 0.5) * width - triangle.finalPosition.x;
      const y2 = (uv2.y - 0.5) * height - triangle.finalPosition.y;

      const vertices = new Float32Array([
        x0, y0, 0,
        x1, y1, 0,
        x2, y2, 0,
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

      // Set UVs for this specific triangle
      const uvs = new Float32Array([
        uv0.x, uv0.y,
        uv1.x, uv1.y,
        uv2.x, uv2.y,
      ]);
      geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

      // Create shader material with motion blur
      const material = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          opacity: { value: 0 },
          velocity: { value: new THREE.Vector3(0, 0, 0) },
        },
        vertexShader: motionBlurShader.vertexShader,
        fragmentShader: motionBlurShader.fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
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

        // Store previous position for velocity calculation
        const prevPos = triangle.prevPosition.clone();

        // Interpolate position from offset to final position
        const startPos = new THREE.Vector3().copy(triangle.finalPosition).add(triangle.offset);
        mesh.position.lerpVectors(startPos, triangle.finalPosition, eased);

        // Calculate velocity for motion blur
        triangle.velocity.subVectors(mesh.position, prevPos);
        triangle.prevPosition.copy(mesh.position);

        // Interpolate rotation
        mesh.rotation.z = triangle.rotation * (1 - eased);

        // Update shader uniforms
        const material = (mesh as THREE.Mesh).material as THREE.ShaderMaterial;
        material.uniforms.opacity.value = Math.min(1, eased);
        material.uniforms.velocity.value.copy(triangle.velocity);
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
