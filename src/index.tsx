import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import {GameController} from './model/gameController'
import {GameView} from './view/gameView'

const TIME_RESOULTION_MS = 50

function Game() {
  const [model, ] = useState(() => new GameController())
  const [viewProps, setViewProps] = useState(model.viewProps)
  useEffect(() => {
    const interval = setInterval(() => {
      model.update()
      setViewProps({...model.viewProps})
    }, TIME_RESOULTION_MS)
    return () => clearInterval(interval);
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
