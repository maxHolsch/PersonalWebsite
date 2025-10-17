'use client';

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';
import WavyBackground from '@/components/WavyBackground';
import BackgroundShader from '@/components/BackgroundShader';
import HorizontalScrollProjects from '@/components/HorizontalScrollProjects';

function HeadshotSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgProgress, setBgProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Headshot fades in quickly (0-0.2 of scroll)
  const headshotOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Background triangles fall into place quickly (0.2-0.4 of scroll = 1/5 of image)
  const backgroundProgress = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  // Update state when motion value changes
  useMotionValueEvent(backgroundProgress, "change", (latest) => {
    setBgProgress(latest);
  });

  return (
    <div ref={containerRef} className="flex flex-col gap-4 relative w-full" style={{ maxWidth: '400px' }}>
      {/* Container for layered images */}
      <div className="relative border-4 border-black overflow-hidden aspect-[3/4]">
        {/* Background shader layer - fills entire container */}
        <div className="absolute inset-0">
          <BackgroundShader scrollProgress={bgProgress} />
        </div>

        {/* Headshot layer - positioned near bottom, centered horizontally, 125% size */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center items-end">
          <motion.img
            src="/headshotTransparent.png"
            alt="Headshot"
            className="relative z-10 h-full w-auto object-contain"
            style={{
              opacity: headshotOpacity,
              transform: 'translateX(60px) translateY(-177.5px) scale(2)'
            }}
          />
        </div>
      </div>
      <p
        className="text-2xl font-black text-center"
        style={{ fontFamily: "var(--font-bebas-neue)" }}
      >
        WHAT I LOOK LIKE
      </p>
    </div>
  );
}

export default function Home() {
  const aboutSectionRef = useRef<HTMLElement>(null);
  const workSectionRef = useRef<HTMLElement>(null);
  const [waveDampening, setWaveDampening] = useState(0);
  const [waveOpacity, setWaveOpacity] = useState(1);

  // Track scroll through About section to dampen waves
  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutSectionRef,
    offset: ["start end", "end start"]
  });

  // Track scroll through Work section to restore waves
  const { scrollYProgress: workProgress } = useScroll({
    target: workSectionRef,
    offset: ["start start", "end end"]
  });

  // Dampen waves as we scroll through About section (70% -> 120%)
  const aboutDampening = useTransform(aboutProgress, [0.7, 1.2], [0, 1]);
  const aboutOpacity = useTransform(aboutProgress, [1.1, 1.3], [1, 0]);

  // Restore waves after Work section (85% -> 100% of Work section scroll)
  const workDampening = useTransform(workProgress, [0.85, 1.0], [1, 0]);
  const workOpacity = useTransform(workProgress, [0.85, 1.0], [0, 1]);

  // Combine both scroll effects
  // Dampening: multiply to get 0 (wavy) -> 1 (straight) -> 0 (wavy)
  // Opacity: max to get 1 (visible) -> 0 (hidden) -> 1 (visible)
  useMotionValueEvent(aboutDampening, "change", (aboutDamp) => {
    const workDamp = workDampening.get();
    setWaveDampening(aboutDamp * workDamp);
  });

  useMotionValueEvent(workDampening, "change", (workDamp) => {
    const aboutDamp = aboutDampening.get();
    setWaveDampening(aboutDamp * workDamp);
  });

  useMotionValueEvent(aboutOpacity, "change", (aboutOp) => {
    const workOp = workOpacity.get();
    setWaveOpacity(Math.max(aboutOp, workOp));
  });

  useMotionValueEvent(workOpacity, "change", (workOp) => {
    const aboutOp = aboutOpacity.get();
    setWaveOpacity(Math.max(aboutOp, workOp));
  });

  return (
    <main className="min-h-screen relative">
      <WavyBackground dampening={waveDampening} opacity={waveOpacity} />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex justify-between items-start">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-1"
          >
            <div className="flex gap-0.5">
              <div className="w-1 h-6 bg-black"></div>
              <div className="w-1 h-6 bg-black"></div>
              <div className="w-1 h-6 bg-black"></div>
              <div className="w-1 h-6 bg-black"></div>
            </div>
          </motion.div>

          {/* Center Nav */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-12 text-sm font-medium tracking-wider"
          >
            <Link href="#about" className="hover:opacity-70 transition-opacity">
              ABOUT
            </Link>
            <Link href="#work" className="hover:opacity-70 transition-opacity">
              WORK
            </Link>
            <Link href="#contact" className="hover:opacity-70 transition-opacity">
              CONTACT
            </Link>
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-end gap-2 text-xs"
          >
            <div className="flex gap-3 items-center">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              {/* QR Code Placeholder */}
              <div className="w-16 h-16 border-2 border-black bg-white flex items-center justify-center text-[6px] font-mono">
                QR
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">Coding from Cambridge, MA</p>
              <p>Contact me</p>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h1
            className="text-[12rem] leading-[0.85] tracking-tighter font-black"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            Solve Deliberation<br />
            Use It To Solve Everything Else
          </h1>
        </motion.div>
      </section>

      {/* About Section */}
      <section ref={aboutSectionRef} id="about" className="min-h-screen flex items-center justify-center px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl w-full"
        >
          <h2
            className="text-8xl font-black mb-12"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            ABOUT
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-xl leading-relaxed">
              <p>
                I&apos;m a graduate student at the MIT Media Lab, working under Deb Roy, where my research focuses on
                computational methods to improve human deliberation. At the core of my work is a deep frustration:
                how difficult it is to get even 50 people in a room to make a genuinely good decision together.
              </p>
              <p>
                So much of modern life is regulated by unexamined norms and taboos that prevent rational collective action.
                History shows us that strong forums and deliberation protocols can change this.
              </p>
              <div className="pt-8">
                <h3 className="text-3xl font-bold mb-4">Current Research:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">→</span>
                    <span>
                      In organizations, how can we scalably train people—using LLMs—to be more comfortable with
                      and open to difficult conversations?
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">→</span>
                    <span>
                      Can we design argument-mapping systems that tangibly improve the decision-making quality
                      of large-scale human groups?
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center lg:justify-start">
              <HeadshotSection />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Work Section - Horizontal Scroll */}
      <HorizontalScrollProjects ref={workSectionRef} />

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl text-center"
        >
          <h2
            className="text-8xl font-black mb-8"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            LET&apos;S TALK
          </h2>
          <p className="text-2xl mb-12">
            Interested in collaboration or want to learn more about my research?
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="mailto:mpholsch@mit.edu"
              className="px-12 py-6 bg-black text-pink-primary text-2xl font-black hover:opacity-80 transition-opacity"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              EMAIL ME
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-bold">LAST UPDATED OCT 2025 @ THE MIT MEDIA LAB</p>
        </div>
      </footer>
    </main>
  );
}
