import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import { api } from "../utils/axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artfact from "../components/Artfact";
import { Code2Icon, CodeIcon, GraduationCap, PanelLeft, Sparkles } from "lucide-react";
import { ArrowFatLineRightIcon } from "@phosphor-icons/react";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const { artifacts } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artifactSidebarOpen, setArtifactSidebarOpen] = useState(false);

  useEffect(() => {
    // Open sidebar by default on screens >= 768px (desktop)
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, [userData]);

  useEffect(() => {
    if (artifacts && artifacts.length > 0 && artifacts[0]?.files?.length > 0) {
      setArtifactSidebarOpen(true);
    } else {
      setArtifactSidebarOpen(false);
    }
  }, [artifacts]);

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data.user.getIdToken();
    try {
      const { data } = await api.post("/auth/login", { token });
      dispatch(setUserdata(data));
    } catch (e) {
      console.error("error in handlelogin ", e);
    }
  };

  return (
    <div className="h-screen w-screen bg-white overflow-hidden relative flex flex-col transition-colors duration-200">
      
      {/* Floating Toggle Button for Sidebar when closed */}
      {!sidebarOpen && userData && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-2.5 left-2.5 md:top-3.5 md:left-4 z-40 p-1 md:p-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-650 hover:text-zinc-900 shadow-xs cursor-pointer flex items-center justify-center transition-all duration-150"
          title="Open Sidebar"
        >
          <ArrowFatLineRightIcon className="w-4 h-4 md:w-6 md:h-6" size={20} />
        </button>
      )}

      {/* Floating Toggle Button for Artifact Drawer when closed and active artifacts exist */}
      {!artifactSidebarOpen && artifacts && artifacts.length > 0 && userData && (
        <button
          onClick={() => setArtifactSidebarOpen(true)}
          className="absolute top-2.5 right-2.5 md:top-3.5 md:right-4 z-40 p-1 md:p-1.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-650 hover:text-zinc-900 shadow-xs cursor-pointer flex items-center justify-center transition-all duration-150"
          title="Open Artifacts Panel"
        >
          <Code2Icon className="w-4 h-4 md:w-6 md:h-6" />
        </button>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex overflow-hidden transition-all duration-300 ${
          !userData ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <ChatArea />
        <Artfact isOpen={artifactSidebarOpen} onClose={() => setArtifactSidebarOpen(false)} />
      </div>

      {/* Login Popup */}
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-md px-4 transition-all duration-300 animate-fade-in font-inter">
          <div className="relative w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-xl flex flex-col items-center text-center">
            {/* Logo Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-900 text-white shadow-md mb-5 select-none font-extrabold text-2xl tracking-tighter font-display">
              HW
            </div>

            {/* Title / Heading */}
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-1 font-display">
              Welcome to HomeWork AI
            </h2>
            <p className="text-xs text-zinc-500 mb-6 max-w-xs font-semibold">
              Your AI-powered learning and study companion
            </p>

            {/* Google Sign-in Button */}
            <button
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 border border-zinc-200 hover:border-zinc-300 bg-white rounded-lg px-4 py-2.5 text-zinc-700 hover:text-zinc-900 text-xs font-bold tracking-wide shadow-xs transition-all active:scale-[0.99] duration-150 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="18"
                height="18"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24c0-1.61-.15-3.16-.42-4.69H24v8.89h12.62c-.54 2.85-2.16 5.27-4.57 6.88l7.1 5.51C43.3 36.55 46.5 30.76 46.5 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.1-5.51c-1.97 1.32-4.49 2.1-8.79 2.1-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center w-full my-6">
              <div className="flex-1 border-t border-zinc-150"></div>
              <span className="px-3 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">OR</span>
              <div className="flex-1 border-t border-zinc-150"></div>
            </div>

            {/* Footer / Terms */}
            <p className="text-[10px] text-center text-zinc-400 leading-relaxed max-w-[240px] font-semibold">
              By continuing, you agree to our{" "}
              <span className="cursor-pointer text-zinc-550 hover:text-zinc-900 underline transition-colors">Terms of Service</span>{" "}
              and{" "}
              <span className="cursor-pointer text-zinc-550 hover:text-zinc-900 underline transition-colors">Privacy Policy</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
