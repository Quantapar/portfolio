import { SITE_NAME } from "../../data/site";
// Light mode only for now. Restore this import and the block below to bring the toggle back.
// import { ThemeToggle } from "../ThemeToggle";
import { Signature } from "../ui/Signature";

export function SiteFooter() {
  return (
    <footer>
      <div className="text-center text-balance text-foreground/60">
        <div className="mb-4 flex justify-center overflow-visible leading-none">
          <Signature
            text={SITE_NAME}
            fontSize={23}
            duration={1.5}
            delay={0.1}
            inView
            once
            className="max-w-full text-foreground/90"
          />
        </div>
        <p>Designed and built by {SITE_NAME}.</p>
        <p className="mt-1.5">
          Inspired by{" "}
          <a
            href="https://www.manuarora.in/"
            target="_blank"
            rel="noreferrer"
            className="link-inline"
          >
            Manu Arora
          </a>{" "}
          and{" "}
          <a
            href="https://www.harshsingh.me/"
            target="_blank"
            rel="noreferrer"
            className="link-inline"
          >
            Harsh Singh
          </a>
          .
        </p>
        {/* <div className="mt-6 flex justify-center">
          <ThemeToggle />
        </div> */}
      </div>
    </footer>
  );
}
