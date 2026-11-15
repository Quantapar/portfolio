import { EarthTimeline } from "./earth-timeline";
import "./earth-timeline.css";

// Copied from the shaders-lab library (packages/react), where the scene was built.
export function EarthTimelinePreview() {
  return (
    <section className="earth-timeline-stage">
      <EarthTimeline autoplay={false} reducedMotion="never" />
    </section>
  );
}
