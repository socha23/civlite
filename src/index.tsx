import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import useAnimationFrame from './useAnimationFrame'

import {GameController} from './model/gameController'
import {GameView} from './view/gameView'

function Game() {
  const [model, setModel] = useState(() => new GameController())
  const [viewProps, setViewProps] = useState(model.viewProps)
  useAnimationFrame((ms: number) => {
    model.onTick(ms / 1000)
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
