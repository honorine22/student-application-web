// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-etp-ink px-5 py-10 text-white">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
        <div className="brand light">
          <span className="brand-mark">E</span>
          <span>
            ETP <small>Admissions</small>
          </span>
        </div>
        <p>Practical skills. Creative confidence. A stronger future.</p>
        <small>
          &copy; {new Date().getFullYear()} ETP Admissions. All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
