import { useState } from 'react';
import { NavBar } from './components/common/NavBar/NavBar';
import { GameScreen } from './features/game/components/GameScreen';
import { useGame } from './features/game/hooks/useGame';
import { HowToPlayScreen } from './features/how-to-play/HowToPlayScreen';
import { ResultScreen } from './features/result/ResultScreen';
import { TitleScreen } from './features/title/TitleScreen';
import { TypeSelectScreen } from './features/type-select/TypeSelectScreen';

export default function App() {
  const { state, startGame, selectType, slideTile, restart } = useGame();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleHome = () => {
    setShowHowToPlay(false);
    restart();
  };

  if (showHowToPlay) {
    return (
      <>
        <NavBar onHome={handleHome} />
        <HowToPlayScreen onBack={() => setShowHowToPlay(false)} />
      </>
    );
  }

  switch (state.phase) {
    case 'title':
      return (
        <>
          <NavBar onHowToPlay={() => setShowHowToPlay(true)} />
          <TitleScreen
            highScore={state.highScore}
            onStart={startGame}
            onHowToPlay={() => setShowHowToPlay(true)}
          />
        </>
      );
    case 'type-select':
      return (
        <>
          <NavBar onHome={handleHome} onHowToPlay={() => setShowHowToPlay(true)} />
          <TypeSelectScreen onSelect={selectType} />
        </>
      );
    case 'playing':
      return (
        <>
          <NavBar onHome={handleHome} onHowToPlay={() => setShowHowToPlay(true)} />
          <GameScreen state={state} onSlide={slideTile} />
        </>
      );
    case 'result':
      return (
        <>
          <NavBar onHome={handleHome} onHowToPlay={() => setShowHowToPlay(true)} />
          <ResultScreen
            score={state.score}
            highScore={state.highScore}
            evolutionResult={state.evolutionResult}
            onRestart={restart}
          />
        </>
      );
  }
}
