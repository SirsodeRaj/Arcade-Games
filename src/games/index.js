// src/games/index.js
// ─────────────────────────────────────────────────────────────────
// GAME COMPONENT REGISTRY
//
// To add a new game:
//   1. Create  src/games/YourGame.jsx   (use GameShell from components)
//   2. Import + add it below
//   3. Add metadata to src/gameRegistry.js
// ─────────────────────────────────────────────────────────────────

import RockPaperScissors from "./RockPaperScissors.jsx";
import GuessNumber       from "./GuessNumber.jsx";
import DiceRoll          from "./DiceRoll.jsx";
import TicTacToe         from "./TicTacToe.jsx";
import MemoryMatch       from "./MemoryMatch.jsx";
import Snake             from "./Snake.jsx";
import WhackAMole        from "./WhackAMole.jsx";
import WordJumble        from "./WordJumble.jsx";
import ColorMatch        from "./ColorMatch.jsx";
import Minesweeper       from "./Minesweeper.jsx";
import TypingSpeed       from "./TypingSpeed.jsx";
import MathBlitz         from "./MathBlitz.jsx";
import Simon             from "./Simon.jsx";
import Hangman           from "./Hangman.jsx";
import CoinFlip          from "./CoinFlip.jsx";
import Breakout          from "./Breakout.jsx";
import HigherLower       from "./HigherLower.jsx";
import ReactionTime      from "./ReactionTime.jsx";
import CountMaster       from "./CountMaster.jsx";
import PasswordGuesser   from "./PasswordGuesser.jsx";
import WordChain         from "./WordChain.jsx";
import SpaceBattle       from "./SpaceBattle.jsx";
import TriviaBlitz       from "./TriviaBlitz.jsx";
import SpeedClick        from "./SpeedClick.jsx";
import SequencePush      from "./SequencePush.jsx";
import Pong              from "./Pong.jsx";
import AnagramHunt       from "./AnagramHunt.jsx";
import BinaryFlip        from "./BinaryFlip.jsx";
import GridPaint         from "./GridPaint.jsx";
import Blackjack         from "./Blackjack.jsx";
import SlidePuzzle       from "./SlidePuzzle.jsx";
import ColorSequence     from "./ColorSequence.jsx";
import TypeRacer         from "./TypeRacer.jsx";
import CatchDrop         from "./CatchDrop.jsx";
import OddOneOut         from "./OddOneOut.jsx";

const GAME_COMPONENTS = {
  rps:           RockPaperScissors,
  guess:         GuessNumber,
  dice:          DiceRoll,
  tictactoe:     TicTacToe,
  memory:        MemoryMatch,
  snake:         Snake,
  whackamole:    WhackAMole,
  wordjumble:    WordJumble,
  colorpicker:   ColorMatch,
  minesweeper:   Minesweeper,
  typingspeed:   TypingSpeed,
  mathblitz:     MathBlitz,
  simon:         Simon,
  hangman:       Hangman,
  coinflip:      CoinFlip,
  breakout:      Breakout,
  higherlower:   HigherLower,
  reactiontime:  ReactionTime,
  countmaster:   CountMaster,
  passwordgen:   PasswordGuesser,
  wordchain:     WordChain,
  spacebattle:   SpaceBattle,
  trivia:        TriviaBlitz,
  speedclick:    SpeedClick,
  sequencepush:  SequencePush,
  pong:          Pong,
  anagram:       AnagramHunt,
  binaryflip:    BinaryFlip,
  gridpaint:     GridPaint,
  blackjack:     Blackjack,
  slidepuzzle:   SlidePuzzle,
  colorsequence: ColorSequence,
  typeracer:     TypeRacer,
  catchdrop:     CatchDrop,
  oddoneout:     OddOneOut,
};

export default GAME_COMPONENTS;