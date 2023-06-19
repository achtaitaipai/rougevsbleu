import { statesList, actions } from "./states";

export type GameStates = (typeof statesList)[number];
export type Actions = (typeof actions)[number];

export type Input = {
  player: 1 | 2;
  action: Actions;
};

export type GameContext = {
  round: number;
  state: GameStates;
  score: [number, number];
  actions: {
    player1: Actions[];
    player2: Actions[];
  };
};

export type State = {
  start?: (ctx: GameContext) => void;
  input?: (inputType: Input, ctx: GameContext) => void;
  exit?: (ctx: GameContext) => void;
};

export type GameMachine = {
  ctx: GameContext;
  states: Record<GameStates, State>;
};
