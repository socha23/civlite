import React from 'react';
import { FontSizes } from './icons';
import { ActionButton3, ActionProps } from './action';

let mouseX = 0
let mouseY = 0

export function getMouseX() {
  return mouseX
}

export function getMouseY() {
  return mouseY
}

export const GameLost = (p: {reset: ActionProps}) => <div style={{
  width: "100%",
  height: "100%",
  position: "absolute",
  zIndex: 100,
  backgroundColor: "black",
  opacity: 0.7,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 20,

}}>
  <div style={{
    fontSize: FontSizes.big,
    color: "#fff",
    textDecoration: "capitalize",
  }}>
    Everybody died.
  </div>
  <div style={{

  }}>
    <ActionButton3 {...p.reset} style={{fontSize: FontSizes.normal, width: 80, height: 30}}>
      Try again
    </ActionButton3>

    </div>


</div>