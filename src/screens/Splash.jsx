import { useNavigate } from "react-router-dom";
import HeroVideo from "../components/HeroVideo.jsx";
import { useStore } from "../state/store.jsx";

export default function Splash() {
  const nav = useNavigate();
  const { user, onboarded } = useStore();

  const go = (e) => {
    e?.stopPropagation?.();
    if (user && onboarded) nav("/home", { replace: true });
    else if (user) nav("/onboarding", { replace: true });
    else nav("/login", { replace: true });
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-void">
      <HeroVideo />
      <img
        src="/brand/logo-10.png"
        alt="BOLTORIUM"
        className="pointer-events-none absolute inset-x-0 top-[18%] z-10 mx-auto w-[92%] max-h-[42%] object-contain mix-blend-screen"
      />
      <button type="button" className="absolute right-3 top-10 z-20 h-10 w-16" onClick={go} aria-label="Skip">
        <img src="/brand/skip-gold.png" alt="Skip" className="h-full w-full object-contain" />
      </button>
    </div>
  );
}
