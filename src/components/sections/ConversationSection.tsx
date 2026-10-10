import { BevelBox } from "../ui/BevelBox";
import { Highlight } from "../ui/Highlight";
import { Signature } from "../ui/Signature";

import { links } from "../../data/site";

export function ConversationSection() {
  return (
    <section className="px-4 py-10 pb-3 sm:px-6">
      <h2 className="text-lg font-medium">Get in touch</h2>

      <p className="mt-6 max-w-md text-balance text-xl leading-snug font-medium tracking-tight sm:text-2xl">
        Building clean interfaces with{" "}
        <Highlight>React, Tailwind, and Motion</Highlight>
      </p>

      <div className="mt-8">
        <BevelBox className="inline-block max-w-full">
          <a
            href={links.cal}
            target="_blank"
            rel="noreferrer"
            className="pressable block px-4 py-3 text-sm text-balance"
          >
            Say hello if you&apos;re building something cool.
          </a>
        </BevelBox>
        <p className="mt-3 text-sm text-foreground/50">
          or{" "}
          <a
            href={links.x}
            target="_blank"
            rel="noreferrer"
            className="link-inline"
          >
            shoot a dm on X
          </a>
        </p>
      </div>

      <div className="mt-16 overflow-visible border-t border-dotted border-border pt-8 pb-0">
        <div className="flex justify-center overflow-visible leading-none">
          <Signature
            text="Manu Sharma"
            fontSize={23}
            duration={1.5}
            delay={0.1}
            inView
            once
            className="max-w-full text-foreground/90"
          />
        </div>
      </div>
    </section>
  );
}
