import { states } from "./states";
import { GameContext, GameStates, Input } from "./types";

const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T =>
  k in obj;

export const newGame = () => {
  const initialContext: GameContext = {
    score: [0, 0],
    actions: { player1: [], player2: [] },
    round: 0,
    state: "idle",
  };
  let currentState = states[initialContext.state];
  const ctx = new Proxy(initialContext, {
    set: (target, property, newValue) => {
      if (property === "state") {
        if (!hasKey(target, property)) return false;
        const newState = states[newValue as GameStates];
        const exitState = currentState.exit;
        if (exitState) exitState(ctx);
        if (newState.start) newState.start(ctx);
        currentState = newState;
      }
      return Reflect.set(target, property, newValue);
    },
  });
  return {
    input: (action: Input) => {
      console.log(ctx.state);
      if (currentState.input) currentState.input(action, ctx);
      console.log(ctx.state);
    },
  };
};
