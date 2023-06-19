import { newGame } from "./game";
import "./style.css";

const game = newGame();

game.input({ action: "left", player: 1 });
