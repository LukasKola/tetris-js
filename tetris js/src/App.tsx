import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './Components/LandingPage/LandingPage';
import GamePage from './Components/Game/GamePage';

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  return (
    <>
      {isGameStarted ? <GamePage onReturnClick={() => setIsGameStarted(false)} /> : <LandingPage onCLick={() => setIsGameStarted(true)}/> }
    </>
  )
}

export default App
