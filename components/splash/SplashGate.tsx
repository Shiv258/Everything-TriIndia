"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import TirangaSplash from "./TirangaSplash";

const SPLASH_KEY = "triindia_splash_seen";
const SKIP_PREFIXES = ["/book", "/admin"];

function SplashGateInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (pathname && SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return;
    }

    if (searchParams.get("splash") === "1") {
      setShow(true);
      return;
    }

    try {
      const seen = window.sessionStorage.getItem(SPLASH_KEY);
      if (!seen) setShow(true);
    } catch {
      // sessionStorage unavailable (private browsing, embedded contexts) — skip splash.
    }
  }, [pathname, searchParams]);

  const handleComplete = () => {
    try {
      window.sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // ignore — splash already played for this session
    }
    setShow(false);
  };

  return (
    <>
      {children}
      <AnimatePresence>
        {show && <TirangaSplash key="tiranga-splash" onComplete={handleComplete} />}
      </AnimatePresence>
    </>
  );
}

export default function SplashGate({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SplashGateInner>{children}</SplashGateInner>
    </Suspense>
  );
}
