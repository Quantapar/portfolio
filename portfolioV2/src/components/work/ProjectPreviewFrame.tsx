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

  return (
    <div
      className={`flex w-full max-w-full items-center justify-center overflow-hidden ${
        compact ? "px-2 py-3" : "px-4 py-8 sm:px-6 sm:py-10"
      } ${className}`.trim()}
    >
      <div className={compact ? "pointer-events-none scale-[0.72] sm:scale-100" : "w-full max-w-full"}>
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
      <BevelBox className={compact ? "overflow-hidden" : "mb-6 overflow-hidden"}>
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

  return <BevelBox className="mb-6 overflow-hidden">{image}</BevelBox>;
}
