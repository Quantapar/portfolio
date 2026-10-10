import { BevelBox } from "../ui/BevelBox";
import { getProjectPreview } from "./previews";

type ProjectPreviewFrameProps = {
  slug: string;
  compact?: boolean;
  className?: string;
};

export function ProjectPreviewFrame({
  slug,
  compact = false,
  className = "",
}: ProjectPreviewFrameProps) {
  const Preview = getProjectPreview(slug);

  if (!Preview) {
    return null;
  }

  if (compact) {
    // Scale visually while keeping the layout box = parent size
    // (plain transform scale alone leaves the unscaled footprint and clips).
    return (
      <div
        className={`relative h-full w-full max-w-full overflow-hidden ${className}`.trim()}
      >
        <div className="pointer-events-none absolute left-0 top-0 flex h-[138.89%] w-[138.89%] origin-top-left scale-[0.72] items-center justify-center p-3 sm:h-full sm:w-full sm:scale-100 sm:p-4">
          <div className="w-full max-w-full">
            <Preview />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full max-w-full items-center justify-center overflow-visible px-3 py-6 sm:px-6 sm:py-10 ${className}`.trim()}
    >
      <div className="w-full min-w-0 max-w-full">
        <Preview />
      </div>
    </div>
  );
}

export function ProjectPreviewOrImage({
  slug,
  src,
  alt,
  compact = false,
}: {
  slug: string;
  src: string;
  alt: string;
  compact?: boolean;
}) {
  const preview = getProjectPreview(slug);

  if (preview) {
    return (
      <BevelBox
        media
        className={compact ? "overflow-hidden" : "mb-6 overflow-visible"}
      >
        <ProjectPreviewFrame slug={slug} compact={compact} />
      </BevelBox>
    );
  }

  const image = (
    <img
      src={src}
      alt={alt}
      className="block h-auto w-full max-w-full object-cover"
    />
  );

  if (compact) {
    return image;
  }

  return (
    <BevelBox media className="mb-6 overflow-hidden">
      {image}
    </BevelBox>
  );
}
