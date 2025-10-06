'use client';

import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { projects } from '@/lib/projectsData';
import Starfield from './Starfield';

export default function HorizontalScrollProjects() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Portal opening: 0 = closed, 1 = fully open
  const portalProgress = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Convert to circle radius percentage (starts small, grows to full screen)
  const portalRadius = useTransform(portalProgress, [0, 1], ['0%', '150%']);

  // Starfield opacity
  const starfieldOpacity = useTransform(portalProgress, [0, 0.5, 1], [0, 1, 1]);

  // Grid opacity (inverted - fades out as portal opens)
  const gridOpacity = useTransform(portalProgress, [0, 1], [1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative z-10"
      style={{ height: '500vh' }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Pink grid background */}
        <motion.div
          className="absolute inset-0 bg-pink-primary"
          style={{
            opacity: gridOpacity,
            backgroundImage: `
              linear-gradient(to right, black 1px, transparent 1px),
              linear-gradient(to bottom, black 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Portal mask layer */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: useTransform(
              portalRadius,
              (r) => `circle(${r} at center)`
            )
          }}
        >
          {/* Dark space environment */}
          <div className="absolute inset-0 bg-black">
            <Starfield opacity={1} />
          </div>

          {/* 3D Projects space */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              perspective: '1000px',
              perspectiveOrigin: 'center center'
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* WORK title in 3D space */}
              <motion.div
                className="absolute"
                style={{
                  opacity: portalProgress,
                  scale: useTransform(scrollYProgress, [0.1, 0.2], [2, 0.5]),
                  z: useTransform(scrollYProgress, [0.1, 0.2], [0, -500]),
                }}
              >
                <h2
                  className="text-9xl font-black text-pink-primary"
                  style={{
                    fontFamily: "var(--font-bebas-neue)",
                    textShadow: '0 10px 30px rgba(255, 51, 136, 0.5)',
                  }}
                >
                  WORK
                </h2>
              </motion.div>

              {/* Project cards in 3D */}
              {projects.map((project, i) => {
                const startProgress = 0.2 + (i * 0.08);
                const endProgress = startProgress + 0.15;

                return (
                  <motion.div
                    key={project.slug}
                    className="absolute"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [startProgress - 0.05, startProgress, endProgress, endProgress + 0.05],
                        [0, 1, 1, 0]
                      ),
                      scale: useTransform(
                        scrollYProgress,
                        [startProgress, endProgress],
                        [0.5, 1.2]
                      ),
                      rotateY: useTransform(
                        scrollYProgress,
                        [startProgress, endProgress],
                        [-15, 15]
                      ),
                      rotateX: useTransform(
                        scrollYProgress,
                        [startProgress, endProgress],
                        [10, -10]
                      ),
                      z: useTransform(
                        scrollYProgress,
                        [startProgress, endProgress],
                        [-800, 200]
                      ),
                    }}
                  >
                    <Link href={`/projects/${project.slug}`}>
                      <div className="group p-8 border-4 border-pink-primary hover:bg-pink-primary hover:text-black transition-all cursor-pointer bg-black text-pink-primary w-[450px] h-[550px] flex flex-col justify-between"
                        style={{
                          boxShadow: '0 20px 60px rgba(255, 51, 136, 0.3)',
                        }}
                      >
                        <div>
                          <h3
                            className="text-4xl font-black mb-4"
                            style={{ fontFamily: "var(--font-bebas-neue)" }}
                          >
                            {project.title}
                          </h3>
                          <p className="text-lg mb-6">{project.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-3 py-1 border-2 border-pink-primary text-sm font-medium tracking-wider group-hover:border-black"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* View Project Link */}
                        <div className="flex items-center gap-2 text-xl font-black">
                          <span style={{ fontFamily: "var(--font-bebas-neue)" }}>
                            VIEW PROJECT
                          </span>
                          <span>→</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
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
}
