import { BevelBox } from "../ui/BevelBox";
import { Highlight } from "../ui/Highlight";

import { links } from "../../data/site";

export function ConversationSection() {
  return (
    <section className="px-6 py-8 pb-12">
      <h2 className="text-lg font-medium">Start a Conversation</h2>

      <p className="mt-6 max-w-md text-2xl leading-snug font-medium tracking-tight">
        Designing intuitive interfaces with{" "}
        <Highlight>modern web tech</Highlight>
      </p>

      <div className="mt-8">
        <BevelBox className="inline-block">
          <a
            href={links.cal}
            target="_blank"
            rel="noreferrer"
            className="pressable block px-4 py-3 text-sm"
          >
            Let&apos;s build something amazing together.
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
