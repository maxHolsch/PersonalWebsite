'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, projects } from '@/lib/projectsData';
import WavyBackground from '@/components/WavyBackground';
import { use } from 'react';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Find current project index for navigation
  const currentIndex = projects.findIndex(p => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <main className="min-h-screen relative">
      <WavyBackground />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-pink-primary/95 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          {/* Back to Home */}
          <Link href="/#work" className="hover:opacity-70 transition-opacity">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 text-sm font-medium tracking-wider"
            >
              <span>← BACK TO WORK</span>
            </motion.div>
          </Link>

          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex gap-0.5"
            >
              <div className="w-1 h-6 bg-black"></div>
              <div className="w-1 h-6 bg-black"></div>
              <div className="w-1 h-6 bg-black"></div>
              <div className="w-1 h-6 bg-black"></div>
            </motion.div>
          </Link>

          {/* Empty div for layout balance */}
          <div className="w-[120px]"></div>
        </div>
      </nav>

      {/* Project Content */}
      <section className="min-h-screen flex items-center justify-center px-6 py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full"
        >
          {/* Project Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-8xl md:text-9xl font-black mb-8"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            {project.title}
          </motion.h1>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl mb-12 font-medium"
          >
            {project.description}
          </motion.p>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 border-2 border-black text-sm font-medium tracking-wider"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Full Description */}
          {project.fullDescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-12 p-8 border-4 border-black bg-white/90"
            >
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {project.fullDescription}
              </p>
            </motion.div>
          )}

          {/* Live Demo Link */}
          {project.url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-12 py-6 bg-black text-pink-primary text-2xl font-black hover:opacity-80 transition-opacity"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                VIEW LIVE DEMO →
              </a>
            </motion.div>
          )}

          {/* Project Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex justify-between items-center pt-12 border-t-4 border-black"
          >
            <div className="flex-1">
              {prevProject && (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="group inline-flex flex-col gap-2 hover:opacity-70 transition-opacity"
                >
                  <span className="text-sm font-medium tracking-wider">← PREVIOUS</span>
                  <span className="text-2xl font-black" style={{ fontFamily: "var(--font-bebas-neue)" }}>
                    {prevProject.shortTitle}
                  </span>
                </Link>
              )}
            </div>

            <div className="flex-1 text-right">
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group inline-flex flex-col gap-2 items-end hover:opacity-70 transition-opacity"
                >
                  <span className="text-sm font-medium tracking-wider">NEXT →</span>
                  <span className="text-2xl font-black" style={{ fontFamily: "var(--font-bebas-neue)" }}>
                    {nextProject.shortTitle}
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-black py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-bold">© 2024 MIT MEDIA LAB</p>
        </div>
      </footer>
    </main>
  );
}
