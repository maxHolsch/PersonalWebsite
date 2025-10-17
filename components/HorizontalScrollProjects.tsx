'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState, forwardRef, type ForwardedRef, type MutableRefObject } from 'react';
import { projects } from '@/lib/projectsData';
import Starfield from './Starfield';
import Image from 'next/image';

/**
 * SCROLL ANIMATION ARCHITECTURE
 * ==============================
 *
 * Container: 500vh tall (5x viewport height) for extended scroll range
 * Viewport: Sticky, stays in place while user scrolls
 *
 * Animation Timeline (based on scrollYProgress 0-1):
 * --------------------------------------------------
 * 0.00 - 0.15: Portal opens (circle expands 0% → 150% radius)
 * 0.10 - 0.25: "WORK" title fades out and recedes into distance
 * 0.15 - 0.25: Moon fades in
 * 0.20 - 0.85: Project cycling zone (each project gets ~8% of range)
 * 0.85 - 1.00: Portal closes (circle shrinks back to 0%)
 *
 * Per-Project Animation:
 * - Total projects: 8
 * - Each project range: 0.65 / 8 ≈ 8.125% of scroll
 * - Inter-project gap: 15% of project range
 * - Fade timing: 15% of range for fade in/out
 * - Dot animation: scale 0.5→1.5, glow opacity 0.3→0.8
 * - Card animation: opacity 0→1, scale 0.8→1
 */

// Dot positions on the moon (percentage coordinates from top-left)
const DOT_POSITIONS = [
  { x: 30, y: 20 },  // top left
  { x: 70, y: 25 },  // top right
  { x: 20, y: 45 },  // middle left
  { x: 50, y: 40 },  // center top
  { x: 78, y: 50 },  // middle right
  { x: 35, y: 70 },  // bottom left
  { x: 55, y: 78 },  // bottom center
  { x: 72, y: 72 },  // bottom right
];

interface ProjectDotProps {
  project: typeof projects[0];
  index: number;
  scrollYProgress: MotionValue<number>;
  onHover: (index: number | null) => void;
  isHovered: boolean;
}

function ProjectDot({ project, index, scrollYProgress, onHover, isHovered }: ProjectDotProps) {
  // Calculate scroll range for this project
  const totalProjects = projects.length;
  const projectScrollRange = 0.65 / totalProjects;
  const gapBetweenProjects = projectScrollRange * 0.15;

  const projectStart = 0.2 + (index * projectScrollRange);
  const projectEnd = projectStart + projectScrollRange - gapBetweenProjects;

  const fadeInEnd = projectStart + (projectScrollRange * 0.15);
  const fadeOutStart = projectEnd - (projectScrollRange * 0.15);

  // Get dot position and determine card placement side
  const dotPos = DOT_POSITIONS[index] || { x: 50, y: 50 };
  const isLeftSide = dotPos.x < 50;

  // Create animation transforms (now safe to use hooks here)
  const dotActivity = useTransform(
    scrollYProgress,
    [projectStart, fadeInEnd, fadeOutStart, projectEnd],
    [0, 1, 1, 0]
  );

  const dotScale = useTransform(dotActivity, [0, 1], [0.5, 1.5]);
  const glowOpacity = useTransform(dotActivity, [0, 1], [0.3, 0.8]);
  const glowScale = useTransform(dotActivity, [0, 1], [1, 1.5]);
  const cardOpacity = useTransform(dotActivity, [0, 1], [0, 1]);
  const cardScale = useTransform(dotActivity, [0, 1], [0.8, 1]);

  return (
    <div>
      {/* Clickable dot marker */}
      <Link href={`/projects/${project.slug}`}>
        <motion.div
          className="absolute cursor-pointer pointer-events-auto z-20"
          style={{
            left: `${dotPos.x}%`,
            top: `${dotPos.y}%`,
            x: '-50%',
            y: '-50%',
          }}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
        >
          <motion.div
            className="relative"
            style={{
              scale: isHovered ? 1.8 : dotScale,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-pink-primary blur-md"
              style={{
                width: '24px',
                height: '24px',
                opacity: isHovered ? 1 : glowOpacity,
                scale: isHovered ? 2 : glowScale,
              }}
              transition={{ duration: 0.2 }}
            />
            {/* Dot core */}
            <motion.div
              className="relative rounded-full bg-pink-primary border-2 border-white"
              style={{
                width: '16px',
                height: '16px',
                boxShadow: isHovered
                  ? '0 0 30px rgba(255, 51, 136, 1)'
                  : '0 0 0px rgba(255, 51, 136, 0)',
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </motion.div>
      </Link>

      {/* Project info card */}
      <motion.div
        className="absolute pointer-events-auto z-30"
        style={{
          left: isLeftSide ? `${dotPos.x + 8}%` : `${dotPos.x - 8}%`,
          top: `${dotPos.y}%`,
          x: isLeftSide ? '0%' : '-100%',
          y: '-50%',
          opacity: cardOpacity,
          scale: cardScale,
        }}
        transition={{
          opacity: { duration: 0.4, ease: 'easeInOut' },
          scale: { duration: 0.4, ease: 'easeInOut' },
        }}
      >
        <Link href={`/projects/${project.slug}`}>
          <motion.div className="group p-4 border-3 border-pink-primary bg-black text-pink-primary hover:bg-pink-primary hover:text-black transition-all cursor-pointer w-[280px]">
            <h3
              className="text-2xl font-black mb-2"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              {project.title}
            </h3>
            <p className="text-sm mb-3 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.slice(0, 2).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-0.5 border border-pink-primary text-xs font-medium tracking-wider group-hover:border-black"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* View Project Link */}
            <div className="flex items-center gap-1 text-sm font-black">
              <span style={{ fontFamily: "var(--font-bebas-neue)" }}>
                VIEW PROJECT
              </span>
              <span>→</span>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

const HorizontalScrollProjects = forwardRef<HTMLElement>(function HorizontalScrollProjects(props, ref: ForwardedRef<HTMLElement>) {
  const internalRef = useRef<HTMLElement | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: internalRef,
    offset: ["start start", "end end"]
  });

  // Portal animation: Opens at start, stays open, closes at end
  const portalProgress = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  const portalRadius = useTransform(portalProgress, [0, 1], ['0%', '150%']);

  // Combine refs so both internal and forwarded refs work
  const setRefs = (el: HTMLElement | null) => {
    internalRef.current = el;
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      (ref as MutableRefObject<HTMLElement | null>).current = el;
    }
  };

  return (
    <section
      ref={setRefs}
      className="relative z-10"
      style={{ height: '500vh' }}
      id="work"
    >
      {/* Sticky viewport - stays in place while section scrolls */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Portal mask - circular reveal of space environment */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: useTransform(
              portalRadius,
              (r) => `circle(${r} at center)`
            )
          }}
        >
          {/* Space environment background */}
          <div className="absolute inset-0 bg-black">
            <Starfield opacity={1} />
          </div>

          {/* Content layer - title and moon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* "WORK" title - appears first, then fades out */}
            <motion.div
              className="absolute"
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [0.1, 0.15, 0.2, 0.25],
                  [1, 1, 0.5, 0]
                ),
                scale: useTransform(scrollYProgress, [0.1, 0.2], [2, 0.5]),
                z: useTransform(scrollYProgress, [0.1, 0.2], [0, -500]),
              }}
            >
              <h2
                className="text-9xl font-black"
                style={{
                  fontFamily: "var(--font-bebas-neue)",
                  color: '#CC0030',
                }}
              >
                WORK
              </h2>
            </motion.div>

            {/* Moon container - fades in as title fades out */}
            <motion.div
              className="relative w-[600px] h-[600px]"
              style={{
                opacity: useTransform(scrollYProgress, [0.15, 0.25], [0, 1])
              }}
            >
              {/* Moon image */}
              <div className="absolute inset-0">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/moon.jpg"
                    alt="Moon"
                    fill
                    className="object-cover"
                    style={{
                      boxShadow: '0 0 100px rgba(255, 255, 255, 0.3)'
                    }}
                  />
                </div>
              </div>

              {/* Project dots and cards */}
              {projects.map((project, i) => (
                <ProjectDot
                  key={project.slug}
                  project={project}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  onHover={setHoveredDot}
                  isHovered={hoveredDot === i}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Portal edge glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: portalProgress,
            background: `radial-gradient(circle at center, transparent 45%, rgba(255, 51, 136, 0.2) 48%, transparent 51%)`
          }}
        />
      </div>
    </section>
  );
});

export default HorizontalScrollProjects;
