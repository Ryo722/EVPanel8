import { useState } from 'react';
import { GameScreen } from './features/game/components/GameScreen';
import { useGame } from './features/game/hooks/useGame';
import { HowToPlayScreen } from './features/how-to-play/HowToPlayScreen';
import { ResultScreen } from './features/result/ResultScreen';
import { TitleScreen } from './features/title/TitleScreen';
import { TypeSelectScreen } from './features/type-select/TypeSelectScreen';

export default function App() {
  const { state, startGame, selectType, slideTile, restart } = useGame();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  if (showHowToPlay) {
    return <HowToPlayScreen onBack={() => setShowHowToPlay(false)} />;
  }

  switch (state.phase) {
    case 'title':
      return (
        <TitleScreen
          highScore={state.highScore}
          onStart={startGame}
          onHowToPlay={() => setShowHowToPlay(true)}
        />
      );
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
