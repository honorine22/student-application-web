"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NotificationBell from "./NotificationBell";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(
    () => onAuthStateChanged(auth, (user) => setIsAuthenticated(Boolean(user))),
    [],
  );
  return (
    <nav className="sticky top-0 z-50 h-[72px] border-b border-black/10 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-[1180px] items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold text-etp-ink"
        >
          <span className="grid size-9 place-items-center rounded-full bg-etp-accent font-serif italic">
            E
          </span>
          <span className="leading-none">
            ETP{" "}
            <small className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-etp-muted">
              Admissions
            </small>
          </span>
        </Link>
        <div className="hidden items-center gap-9 text-sm font-semibold text-etp-ink md:flex">
          <Link
            className="border-b-2 border-transparent py-6 hover:border-etp-accent"
            href="/#programs"
          >
            Programs
          </Link>
          <Link
            className="border-b-2 border-transparent py-6 hover:border-etp-accent"
            href="/register"
          >
            How to apply
          </Link>
          <Link
            className="border-b-2 border-transparent py-6 hover:border-etp-accent"
            href="/login"
          >
            Admin
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationBell />}
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-etp-accent px-4 py-3 text-sm font-bold text-etp-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-5"
          >
            Start application <span>↗</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
