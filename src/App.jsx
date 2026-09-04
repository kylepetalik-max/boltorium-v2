import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PhoneShell from './components/PhoneShell.jsx';
import { useStore } from './state/store.jsx';
import { startVoice, speak } from './lib/voice.js';
import MarketingHome from './pages/MarketingHome.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import Ecosystem from './pages/Ecosystem.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Splash from './screens/Splash.jsx';
import Login from './screens/Login.jsx';
import Onboarding from './screens/Onboarding.jsx';
import Home from './screens/Home.jsx';
import Ride from './screens/Ride.jsx';
import Recap from './screens/Recap.jsx';
import MapScreen from './screens/MapScreen.jsx';
import Rank from './screens/Rank.jsx';
import Garage from './screens/Garage.jsx';
import Wallet from './screens/Wallet.jsx';
import Shop from './screens/Shop.jsx';
import Tune from './screens/Tune.jsx';
import Missions from './screens/Missions.jsx';
import Profile from './screens/Profile.jsx';
import Airdrops from './screens/Airdrops.jsx';
import Feed from './screens/Feed.jsx';

const MARKETING = new Set(['/', '/how-it-works', '/ecosystem', '/roadmap']);

function Gate({ children }) {
  const { hydrated, user, onboarded } = useStore();
  if (!hydrated) return <div className="flex flex-1 items-center justify-center text-bolt">…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

function AppChrome({ children }) {
  const loc = useLocation();
  if (MARKETING.has(loc.pathname)) return children;
  return <PhoneShell>{children}</PhoneShell>;
}

export default function App() {
  const store = useStore();
  const nav = useNavigate();

  useEffect(() => {
    if (!store.user) return undefined;
    const stop = startVoice({
      onStart: () => {
        if (!store.ride) nav('/ride');
      },
      onEnd: () => {
        if (store.ride) store.endRide();
        nav('/recap');
      },
      onWhere: () => {
        const p = store.ride?.points?.at?.(-1);
        if (p) speak(`You are at ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`);
        else speak('No GPS fix yet');
      },
      onStatus: (voice) => store.setVoice(voice),
    });
    return stop;
  }, [store.user, store.ride?.id]);

  return (
    <AppChrome>
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/ecosystem" element={<Ecosystem />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/app" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Gate><Home /></Gate>} />
        <Route path="/ride" element={<Gate><Ride /></Gate>} />
        <Route path="/recap" element={<Gate><Recap /></Gate>} />
        <Route path="/map" element={<Gate><MapScreen /></Gate>} />
        <Route path="/rank" element={<Gate><Rank /></Gate>} />
        <Route path="/garage" element={<Gate><Garage /></Gate>} />
        <Route path="/wallet" element={<Gate><Wallet /></Gate>} />
        <Route path="/shop" element={<Gate><Shop /></Gate>} />
        <Route path="/tune" element={<Gate><Tune /></Gate>} />
        <Route path="/missions" element={<Gate><Missions /></Gate>} />
        <Route path="/profile" element={<Gate><Profile /></Gate>} />
        <Route path="/airdrops" element={<Gate><Airdrops /></Gate>} />
        <Route path="/feed" element={<Gate><Feed /></Gate>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppChrome>
  );
}
