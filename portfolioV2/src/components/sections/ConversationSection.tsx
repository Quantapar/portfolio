import { BevelBox } from "../ui/BevelBox";
import { Highlight } from "../ui/Highlight";

import { links } from "../../data/site";

export function ConversationSection() {
  return (
    <section className="px-6 py-8 pb-12">
      <h2 className="text-lg font-medium">Start a Conversation</h2>

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
      </div>

      <div className="mt-16 border-t border-dotted border-border pt-8 text-center text-sm text-foreground/50">
        <p>
          Designed &amp; Developed by{" "}
          <span className="font-medium text-foreground">Manu Sharma</span>
        </p>
        <p className="mt-1">© 2026 All rights reserved.</p>
      </div>
    </section>
  );
}
