// Types for the part of the Anatomy 3D runtime (turn.mjs) that figures use.

export type TurnValues = Record<string, number>;

export type TurnController = {
  /** Sets group values (degrees for turn and hinge groups) and renders. */
  set(values: TurnValues | number, options?: { detail?: number }): unknown;
  render(): void;
  readonly values: TurnValues;
  destroy(): void;
};

export const TURN: {
  mount(
    stage: Element,
    data: unknown,
    options?: {
      follow?: (values: TurnValues) => TurnValues;
      onHold?: () => void;
      onFrame?: (controller: TurnController) => void;
    },
  ): TurnController;
};

export const TURN_CSS: string;
