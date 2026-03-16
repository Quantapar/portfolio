import React from "react";

export const Footer = () => (
  <footer className="w-full max-w-2xl mx-auto px-6 pb-32 -mt-20">
    <div className="rounded-2xl border-2 border-(--border-color) bg-(--bg-secondary) p-8 flex flex-col items-center gap-6">
      <div className="flex gap-6 text-sm text-(--text-muted)">
        <a
          href="https://x.com/quantapar"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-(--text-primary) transition-colors"
        >
          Twitter
        </a>
        <a
          href="https://github.com/Quantapar"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-(--text-primary) transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/manu-sharma-6012bb32a/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-(--text-primary) transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://discord.com/users/762906412564217857"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-(--text-primary) transition-colors"
        >
          Discord
        </a>
      </div>
      <div className="flex flex-col items-center text-xs text-(--text-muted) gap-1">
        <span className="flex items-center gap-1">
          Design & Developed by{" "}
          <span className="font-medium text-(--text-primary)">Manu Sharma</span>
        </span>
        <span className="opacity-60">
          © {new Date().getFullYear()}. All rights reserved.
        </span>
      </div>
    </div>
  </footer>
);
