import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChatCircle, Cursor, DotsThree, HashStraight, PenNib, Shapes, SquaresFour, TextT } from "@phosphor-icons/react";
import "./radial-tool.css";

function supportsHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

const radialTools = [
  { id: "move", label: "Move Tool", Icon: Cursor, position: 0 },
  { id: "pen", label: "Pen Tool", Icon: PenNib, position: 1 },
  { id: "text", label: "Text", Icon: TextT, position: 2 },
  { id: "actions", label: "Actions", Icon: SquaresFour, position: 3 },
  { id: "more", label: "More", Icon: DotsThree, position: 4 },
  { id: "comment", label: "Comment", Icon: ChatCircle, position: 5 },
  { id: "objects", label: "Objects", Icon: Shapes, position: 6 },
  { id: "frame", label: "Frame", Icon: HashStraight, position: 7 },
] as const;

type RadialToolId = (typeof radialTools)[number]["id"];

export function RadialToolMenuPreview() {
  const reduceMotion = useReducedMotion();
  const [selectedTool, setSelectedTool] = useState<RadialToolId>("move");
  const [hoveredTool, setHoveredTool] = useState<RadialToolId | null>(null);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [sectorAngle, setSectorAngle] = useState(0);
  const activeTool = hoveredTool ?? selectedTool;
  const activeIndex = radialTools.findIndex((tool) => tool.id === activeTool);
  const activeLabel = radialTools[activeIndex].label;
  const instantMotion = reduceMotion || keyboardNavigation;
  const radialSpring = instantMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 280, damping: 25, mass: 0.82 };

  const moveSectorTo = (toolId: RadialToolId) => {
    const targetAngle =
      radialTools.findIndex((tool) => tool.id === toolId) * 45;
    setSectorAngle((currentAngle) => {
      const normalizedCurrent = ((currentAngle % 360) + 360) % 360;
      const shortestTurn =
        ((targetAngle - normalizedCurrent + 540) % 360) - 180;

      return currentAngle + shortestTurn;
    });
  };

  return (
    <section
      id="radial-tool-menu-demo"
      className="radial-tool-stage"
      aria-label="Animated radial tool menu"
    >
      <div
        className="radial-tool-menu"
        role="toolbar"
        aria-label="Canvas tools"
        onPointerLeave={() => {
          moveSectorTo(selectedTool);
          setHoveredTool(null);
        }}
      >
        <div className="radial-tool-menu__orbit" aria-hidden="true">
          <motion.span
            className="radial-tool-menu__sector"
            initial={false}
            animate={{
              transform: `translate(-50%, -100%) rotate(${sectorAngle}deg)`,
            }}
            transition={radialSpring}
          />
          <motion.span
            className="radial-tool-menu__active-arc"
            initial={false}
            animate={{ transform: `rotate(${sectorAngle}deg)` }}
            transition={radialSpring}
          />
          <motion.span
            className="radial-tool-menu__center"
            initial={false}
            animate={{
              borderColor: "#187DFF",
              transform: instantMotion
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(1.015)",
            }}
            transition={radialSpring}
          />
        </div>

        {radialTools.map(({ id, label, Icon, position }) => {
          const isActive = id === activeTool;
          const isMore = id === "more";

          return (
            <button
              className={`radial-tool radial-tool--${id}`}
              type="button"
              aria-label={label}
              aria-pressed={id === selectedTool}
              data-active={isActive}
              onPointerEnter={() => {
                if (!supportsHover()) return;
                setKeyboardNavigation(false);
                moveSectorTo(id);
                setHoveredTool(id);
              }}
              onFocus={(event) => {
                const fromKeyboard =
                  event.currentTarget.matches(":focus-visible");
                setKeyboardNavigation(fromKeyboard);
                if (fromKeyboard) {
                  moveSectorTo(id);
                  setHoveredTool(id);
                }
              }}
              onBlur={() => {
                moveSectorTo(selectedTool);
                setHoveredTool(null);
                setKeyboardNavigation(false);
              }}
              onClick={() => {
                moveSectorTo(id);
                setSelectedTool(id);
              }}
              key={id}
            >
              {!isMore && (
                <span className="radial-tool__icon">
                  {isActive && (
                    <motion.span
                      className="radial-tool__icon-active"
                      layoutId="radial-icon-active"
                      transition={radialSpring}
                    />
                  )}
                  <Icon
                    weight={id === "text" || id === "frame" ? "bold" : "fill"}
                    aria-hidden="true"
                  />
                </span>
              )}

              <span className="radial-tool__label">
                {isActive && (
                  <motion.span
                    className="radial-tool__label-active"
                    layoutId="radial-label-active"
                    transition={radialSpring}
                  />
                )}
                <span className="radial-tool__label-text">{label}</span>
                {isMore && <DotsThree weight="bold" aria-hidden="true" />}
              </span>

              <span className="sr-only">
                Position {position + 1} of {radialTools.length}
              </span>
            </button>
          );
        })}

        <span className="sr-only" aria-live="polite">
          {activeLabel} active
        </span>
      </div>
    </section>
  );
}

