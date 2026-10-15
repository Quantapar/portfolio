import { DitheredLogo } from "../../../ui/DitheredLogo";

export function Dithered404Preview() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-2 py-6">
      <div className="relative h-52 w-full max-w-2xl sm:h-64">
        <DitheredLogo
          imageSrc="/work/404-dither.svg"
          particleColor="#FE551A"
          scale={0.92}
        />
      </div>
      <p className="text-center text-sm font-medium tracking-tight text-foreground sm:text-base">
        This page went up in smoke.
      </p>
    </div>
  );
}
