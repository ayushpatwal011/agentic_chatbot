import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code,
  Globe,
  FileText,
  Presentation,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      no: "01",
      category: "REAL TIME SEARCH",
      icon: <Globe className="w-6 h-6 text-zinc-900" />,
      title: "Real-Time Web Research",
      description: "Fact-check news, search current events, and pull the latest online documentation effortlessly.",
    },
    {
      no: "02",
      category: "CODING",
      icon: <Code className="w-6 h-6 text-zinc-900" />,
      title: "Interactive Coding Suite",
      description: "Ask programming questions, debug state bugs, and download full sandbox source code instantly via the side-panel drawer.",
    },
    {
      no: "03",
      category: "RAG",
      icon: <MagnifyingGlassIcon className="w-6 h-6 text-zinc-900" />,
      title: "RAG (Retrieval-Augmented Generation) Research",
      description: "Upload and analyze , extract text or synthesize photorealistic 8k illustrations from scratch.",
    },
    {
      no: "04",
      category: "PPT GENERATION",
      icon: <Presentation className="w-6 h-6 text-zinc-900" />,
      title: "PPT Slide Builder",
      description: "Draft comprehensive presentation slides outline and download ready-to-use PPTX decks in seconds.",
    },
    {
      no: "05",
      category: "PDF GENERATION",
      icon: <FileText className="w-6 h-6 text-zinc-900" />,
      title: "Document & PDF Architect",
      description: "Generate structured study materials, outlines, and detailed reports exported directly to PDF.",
    },
    {
      no: "06",
      category: "IMAGE GENERATION",
      icon: <Sparkles className="w-6 h-6 text-zinc-900" />,
      title: "Image Analyzer & Generator",
      description: "Upload and analyze diagrams, extract text from charts, or synthesize photorealistic 8k illustrations from scratch.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-zinc-900 flex flex-col font-inter overflow-x-hidden selection:bg-zinc-950 selection:text-white">
      {/* Decorative Traditional Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e0_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_10%,#000_80%,transparent_100%)] pointer-events-none -z-10" />

      {/* Decorative vertical running text on left margin */}
      <div className="hidden lg:flex absolute left-8 top-1/4 flex-col items-center gap-4 text-zinc-350 font-bold select-none pointer-events-none tracking-widest [writing-mode:vertical-rl] text-[9px] uppercase">
        <span>HomeWork AI Workspace Toolkit</span>
        <div className="w-[1px] h-32 bg-zinc-200" />
        <span>Study Smart and Create Faster</span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#FDFDFB]/85 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-none border-2 border-zinc-900 text-zinc-900 flex items-center justify-center font-extrabold text-sm select-none hover:bg-zinc-900 hover:text-white transition-colors duration-300">
              HW
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-zinc-955 text-sm md:text-xs tracking-wider">HomeWork AI</span>
              <span className="text-[9px] md:text-[7px] text-zinc-400 font-bold tracking-widest -mt-0.5">WORKSPACE EDITION</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
            <a href="#concept" className="hover:text-zinc-900 transition-colors">Concept</a>
            <a href="#about" className="hover:text-zinc-900 transition-colors">About Us</a>
          </nav>

          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-5 py-3 bg-zinc-955 hover:bg-zinc-800 text-white text-sm md:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            Try It Now
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 md:pt-28 md:pb-20 max-w-5xl mx-auto px-6 text-center">
        {/* Red Accent Stamp Shape */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-black text-[9px] select-none tracking-tighter rotate-12 scale-95 shadow-inner">
            HW AI
          </div>
          <div className="flex flex-col items-start text-left">
            
            <span className="text-base font-extrabold text-zinc-855 tracking-wider uppercase">Next-generation study assistant</span>
          </div>
        </div>

        {/* Big Headings */}
        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[90px] font-black tracking-tighter text-zinc-955 leading-[1.02] mb-8 text-center uppercase">
          Autonomous. <br />
          Multi-agent. <br />
          <span className="bg-gradient-to-r from-red-600 via-zinc-700 to-zinc-900 bg-clip-text text-transparent">
            HomeWork AI
          </span>
        </h1>

        {/* Minimalist Sub-details */}
        <div className="max-w-xl mx-auto border-t border-b border-zinc-200 py-6 my-8">
          <p className="text-base text-zinc-500 leading-relaxed font-bold tracking-wide">
           A Multi Agent Full Stack learning platfrom, IT support RAG, Image , PPT , PDF , Code Generation, Code Execution, and much more, 
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4.5 bg-zinc-955 hover:bg-zinc-900 text-white text-sm md:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-md"
          >
            Launch Chat Workspace
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-8 py-4.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 text-sm md:text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Grid Border Section (Inspired by tatami and clean grid layout) */}
      <section id="features" className="py-20 bg-white border-t border-b border-zinc-200 relative">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 pb-10 mb-16 text-left">
            <div className="space-y-2">
              <span className="text-xs md:text-[10px] font-extrabold text-red-500 tracking-widest block uppercase">Agent Functions & Ecosystem</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-zinc-955 tracking-tight">
                Specialized Agents.
              </h2>
            </div>
            <p className="text-base text-zinc-500 max-w-sm font-semibold leading-relaxed mt-4 md:mt-0">
              MICROSERVICE BACKEND ARCHITECTURE|
            </p>
          </div>

          {/* Asymmetrical minimalist grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-zinc-200">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-[#FDFDFB] hover:bg-white border-r border-b border-zinc-200 transition-all duration-300 hover:shadow-inner flex flex-col justify-between text-left min-h-[260px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-zinc-300 text-xs tracking-widest">{feature.no}</span>
                    <span className="text-[11px] md:text-[9px] font-extrabold text-zinc-400 border border-zinc-200 px-2 py-0.5 rounded-none uppercase tracking-widest">{feature.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2.5 border border-zinc-900/10 rounded-none bg-zinc-100/50 flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-base md:text-sm font-black text-zinc-900 uppercase tracking-tight">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-base text-zinc-500 font-semibold leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs md:text-[9px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1 cursor-pointer" onClick={() => navigate("/home")}>
                    Activate Agent
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Concept Layout */}
      <section id="concept" className="py-20 bg-[#FDFDFB]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col lg:flex-row border border-zinc-200">
          
          {/* Left Block */}
          <div className="flex-1 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-zinc-200 text-left space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs md:text-[10px] font-extrabold text-red-500 tracking-widest block uppercase">UX Concept & Design</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-955 uppercase tracking-tight leading-tight">
                Simplicity in execution, <br />
                Depth in response.
              </h2>
              <p className="text-base text-zinc-500 leading-relaxed font-bold">
                By pairing clean visual panels with a robust multi-agent backend, we ensure study files are processed, compiled, and visualized neatly.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-100 space-y-3.5 text-base font-bold text-zinc-700">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-none" />
                <span>Side-by-side interactive code sandbox</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-none" />
                <span>Expired-safe temporary S3 buckets</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-none" />
                <span>Minimalist high-contrast user interface</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/home")}
              className="mt-8 self-start flex items-center gap-2 px-7 py-4 bg-zinc-955 hover:bg-zinc-800 text-white text-sm md:text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Block (Concept Mock UI) */}
          <div className="flex-1 p-8 sm:p-12 bg-zinc-50/50 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-none border border-zinc-300 bg-white p-6 shadow-sm text-left">
              {/* Fake Window header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-none border border-zinc-900 bg-zinc-955" />
                  <span className="text-xs md:text-[10px] font-black uppercase tracking-widest text-zinc-900">Workspace / HW AI</span>
                </div>
                <span className="text-[10px] md:text-[8px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5">AGENT: CODING</span>
              </div>

              {/* Fake message rows */}
              <div className="space-y-4 font-inter text-xs md:text-[10.5px]">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] md:text-[8px] font-bold text-zinc-400 uppercase tracking-widest">User Request</span>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 text-zinc-700 font-semibold leading-relaxed">
                    Write a clean Code of Liner Search in Python
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] md:text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Assistant Response</span>
                  <div className="p-3 border border-zinc-900/10 text-zinc-800 font-semibold leading-relaxed bg-[#FDFDFB]">
                    ⚡ Code generated. View code inside the right panel drawer.
                  </div>
                </div>

                {/* Fake file button */}
                <div className="flex items-center justify-between p-2 border border-zinc-900 text-zinc-900 font-mono text-xs md:text-[9px] font-black hover:bg-zinc-900 hover:text-white transition-all cursor-pointer">
                  <span>linear_search.py</span>
                  <span className="text-[10px] md:text-[8px] font-bold border border-current px-1 py-0.25">READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="mt-auto bg-zinc-955 text-zinc-500 py-16 border-t border-zinc-900 font-inter">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-none border bg-black border-zinc-700 text-white flex items-center justify-center font-bold text-xs select-none">
                HW
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight select-none">HomeWork AI</span>
            </div>
            <p className="text-xs md:text-[10px] leading-relaxed max-w-xs font-semibold text-zinc-900">
              Adapting bleeding-edge AI models into a functional study suite to let you learn, create, and research faster.
            </p>
          </div>

          <div>
            <h4 className="text-zinc-900 text-xs md:text-[10px] font-bold uppercase tracking-widest mb-4">Core Modules</h4>
            <ul className="space-y-2 text-xs md:text-[10.5px] font-semibold text-zinc-900">
              <li><a href="#features" className="hover:text-white transition-colors">Coding Agent</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Presentation Agent</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Web Research</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Image Generator</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-900 text-xs md:text-[10px] font-bold uppercase tracking-widest mb-4">Ownership</h4>
            <p className="text-xs md:text-[10px] leading-relaxed font-semibold text-zinc-900">
              © {new Date().getFullYear()} HomeWork AI. All rights reserved. <br />
              Structural design layout modeled for premium, high-speed pairing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
