import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Globe, Code2, FileText, Sparkles } from "lucide-react";

const steps = [
  {
    icon: GraduationCap,
    label: "Preparing study space...",
    color: "text-indigo-400",
    glow: "shadow-[0_0_50px_rgba(129,140,248,0.15)]",
    border: "border-indigo-500/20"
  },
  {
    icon: Globe,
    label: "Initializing real-time search...",
    color: "text-sky-400",
    glow: "shadow-[0_0_50px_rgba(56,189,248,0.15)]",
    border: "border-sky-500/20"
  },
  {
    icon: Code2,
    label: "Loading interactive sandbox...",
    color: "text-emerald-400",
    glow: "shadow-[0_0_50px_rgba(52,211,153,0.15)]",
    border: "border-emerald-500/20"
  },
  {
    icon: FileText,
    label: "Building workspace document tool...",
    color: "text-amber-400",
    glow: "shadow-[0_0_50px_rgba(251,191,36,0.15)]",
    border: "border-amber-500/20"
  },
  {
    icon: Sparkles,
    label: "Waking up AI companion...",
    color: "text-purple-400",
    glow: "shadow-[0_0_50px_rgba(192,132,252,0.15)]",
    border: "border-purple-500/20"
  }
];

export default function LoginLoading() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden select-none">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-900/40 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Loading Box */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* Loading Ring with Rotating Dash */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-8">
          {/* Static outer ring */}
          <div className="absolute inset-0 rounded-full border border-zinc-800" />
          
          {/* Animated gradient ring */}
 {/* Animated gradient ring */}
<svg
  className="absolute inset-0 w-full h-full"
  viewBox="0 0 112 112"
  preserveAspectRatio="xMidYMid meet"
>
  <circle
    cx="56"
    cy="56"
    r="53"
    className="stroke-zinc-750 fill-none"
    strokeWidth="2.5"
  />
  <motion.circle
    cx="56"
    cy="56"
    r="53"
    className="stroke-zinc-200 fill-none"
    strokeWidth="2.5"
    strokeDasharray="330"
    style={{
      transformBox: "fill-box",
      transformOrigin: "center",
      rotate: "-90deg",
    }}
    initial={{ strokeDashoffset: 330 }}
    animate={{
      strokeDashoffset: [330, 0],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</svg>

          {/* Central Icon Container with changing glows and borders */}
          <motion.div 
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`w-20 h-20 rounded-full bg-zinc-900 border ${step.border} ${step.glow} flex items-center justify-center z-10 transition-all duration-500`}
          >
            <Icon className={`w-9 h-9 ${step.color} transition-colors duration-500`} />
          </motion.div>
        </div>

        {/* Dynamic Label Text */}
        <div className="h-6 flex items-center justify-center mb-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="text-sm font-medium tracking-wide text-zinc-300 font-sans"
            >
              {step.label}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Sub-label */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 font-sans">
          Take few moments, Connecting to server...
        </p>

        {/* Minimal Steps Progress Bar / Dots */}
        <div className="flex gap-2.5 mt-8 items-center">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className="relative w-2 h-2 rounded-full overflow-hidden bg-zinc-800"
            >
              {currentStep === index && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
