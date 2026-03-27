import { GameScreen } from './features/game/components/GameScreen';
import { useGame } from './features/game/hooks/useGame';
import { ResultScreen } from './features/result/ResultScreen';
import { TitleScreen } from './features/title/TitleScreen';
import { TypeSelectScreen } from './features/type-select/TypeSelectScreen';

export default function App() {
  const { state, startGame, selectType, slideTile, restart } = useGame();

  switch (state.phase) {
    case 'title':
      return <TitleScreen highScore={state.highScore} onStart={startGame} />;
    case 'type-select':
      return <TypeSelectScreen onSelect={selectType} />;
    case 'playing':
      return <GameScreen state={state} onSlide={slideTile} />;
    case 'result':
      return (
        <ResultScreen
          score={state.score}
          highScore={state.highScore}
          evolutionResult={state.evolutionResult}
          onRestart={restart}
        />
      );
  }
}
