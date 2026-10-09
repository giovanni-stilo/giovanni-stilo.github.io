"use client";

import Link from "next/link";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { SchlierenRig } from "@/components/ui/hero-ascii-schlieren";

const ease = [0.2, 0.9, 0.1, 1] as const;
const NAME = "Giovanni Stilo";

const char: Variants = {
  hidden: { y: "110%", rotate: 8, opacity: 0 },
  shown: (i: number) => ({
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.9, ease, delay: i * 0.035 + 0.1 },
  }),
};

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

function SplitName() {
  let i = 0;
  return (
    <motion.h1 aria-label={NAME} initial="hidden" animate="shown">
      {NAME.split(" ").map((word, w) => (
        <span key={word}>
          {w > 0 ? " " : null}
          <span className="word" aria-hidden="true">
            {word.split("").map((ch) => (
              <motion.span
                key={i}
                className="char"
                custom={i++}
                variants={char}
                whileHover={{ y: "-0.08em", rotate: -6, color: "var(--color-signal)" }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </span>
      ))}
    </motion.h1>
  );
}

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      {/* The pointer rotates the schlieren knife edge across the whole hero. */}
      <SchlierenRig className="hero hero-rig min-h-[min(82svh,820px)]" cellSize={13}>
        <div className="container hero-inner">
          <motion.div
            className="hero-photo-wrapper"
            initial={{ y: -40, rotate: -14, opacity: 0 }}
            animate={{ y: 0, rotate: -3, opacity: 1 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
            <img src="/assets/img/profile.jpeg" alt="Professor Giovanni Stilo" className="hero-photo" width={170} height={170} />
          </motion.div>
          <div className="hero-content">
            <SplitName />
            <motion.p className="hero-subtitle" {...rise(0.5)}>
              Associate Professor · AI, Data &amp; Decision Sciences
            </motion.p>
            <motion.p className="hero-affiliation" {...rise(0.62)}>
              <strong>Luiss University of Rome</strong> &middot; Founder of the{" "}
              <a href="https://aiimlab.org" target="_blank" rel="noopener">
                AIIM Research Collective
              </a>
            </motion.p>
            <motion.div className="hero-links" {...rise(0.74)}>
              <a href="https://scholar.google.com/citations?hl=en&user=uTyaicMAAAAJ" target="_blank" rel="noopener">
                <i className="fas fa-graduation-cap" /> Scholar
              </a>
              <a href="https://github.com/aiim-research" target="_blank" rel="noopener">
                <i className="fab fa-github" /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/giovanni-stilo-7986b816/" target="_blank" rel="noopener">
                <i className="fab fa-linkedin" /> LinkedIn
              </a>
              <a href="mailto:gstilo@luiss.it">
                <i className="fas fa-envelope" /> Contact
              </a>
              <Link href="/about/">
                <i className="fas fa-user" /> Full Bio
              </Link>
            </motion.div>
          </div>
        </div>
      </SchlierenRig>
      {/* Without JS the intro never plays: show everything in its final state. */}
      <noscript>
        <style>{`.hero-rig [style]{opacity:1!important;transform:none!important}.hero-rig .hero-photo-wrapper[style]{transform:rotate(-3deg)!important}`}</style>
      </noscript>
    </MotionConfig>
  );
}
