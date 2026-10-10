import { SITE_NAME } from "../../data/site";
import { Signature } from "../ui/Signature";
import { GridDivider } from "./GridDivider";

type SiteFooterProps = {
  /** Signs off with the animated signature above the credits. */
  signature?: boolean;
};

export function SiteFooter({ signature = false }: SiteFooterProps) {
  return (
    <footer>
      <GridDivider />
      <div className="px-4 pt-8 pb-10 text-center text-sm text-balance text-foreground/60 sm:px-6">
        {signature ? (
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
        ) : null}
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
      </div>
    </footer>
  );
}
