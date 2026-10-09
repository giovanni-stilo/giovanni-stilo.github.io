"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: scrollYProgress }} />;
}
