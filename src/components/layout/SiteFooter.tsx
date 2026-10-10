import { SITE_NAME } from "../../data/site";
// Light mode only for now. Restore this import and the block below to bring the toggle back.
// import { ThemeToggle } from "../ThemeToggle";
import { Signature } from "../ui/Signature";

export function SiteFooter() {
  return (
    // Extra room above, so the signature reads as a sign-off and not as one more section.
    <footer className="mt-20">
      <div className="flex justify-center overflow-visible leading-none">
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
      {/* <div className="mt-6 flex justify-center">
        <ThemeToggle />
      </div> */}
    </footer>
  );
}
