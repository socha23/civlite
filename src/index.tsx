import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import useAnimationFrame from './useAnimationFrame'

import {GameModel} from './model/gameModel'
import {GameView} from './view/gameView'
import {initGameState} from './state/gameState'

function Game() {
  const [model, setModel] = useState(new GameModel())
  const [viewProps, setViewProps] = useState(model.viewProps)
  useAnimationFrame((ms: number) => {
    model.updateState(ms / 1000)
    setViewProps({...model.viewProps})
  })
  return <GameView {...viewProps}/>
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
