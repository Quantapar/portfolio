import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { CopyIcon, CheckIcon } from "../Icons";

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export const CodeBlock = ({ code, lang = "tsx" }: CodeBlockProps) => {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    codeToHtml(code.trim(), {
      lang,
      theme: isDark ? "github-dark" : "github-light",
    }).then(setHtml);
  }, [code, lang, isDark]);

  const copyCode = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="sticky top-0 z-20 pointer-events-none flex justify-end">
        <button
          onClick={copyCode}
          className="pointer-events-auto m-3 p-1.5 rounded-md bg-(--bg-tertiary)/80 backdrop-blur-sm border border-(--border-color) text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out cursor-pointer"
          title="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <div
        className="overflow-x-auto text-[13px] leading-relaxed [&_pre]:p-4 [&_pre]:pt-0 [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:pr-12 -mt-12"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
