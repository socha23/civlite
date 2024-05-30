import React from 'react';

import { Action } from '../model/gameModel'


export type ActionProps = {
  title: string
  action: () => void
  timeout?: number
  timeoutLeft?: number
  disabled?: any
}


export function propsForAction(a: Action, title: string): ActionProps {
  return {
    title: title,
    action: () => a.onAction(),
    timeout: a.timeout, 
    timeoutLeft: a.timeoutLeft,
    disabled: a.disabled
  }
}

const BUTTON_STYLE_ENABLED = {
  color: "black",
  borderColor: "#666",
  backgroundColor: "#eee",
  cursor: "pointer",
}

const BUTTON_STYLE_DISABLED = {
  color: "#bbb",
  borderColor: "#bbb",
  backgroundColor: "#eee",
  cursor: "not-allowed",
}

export const ActionButton = (a: ActionProps) =>
  <div style={{
      display: "inline-block",
      zIndex: 0,
      position: "relative",
      margin: 3,
      userSelect: "none",
      cursor: (a.disabled || a.timeoutLeft ? BUTTON_STYLE_DISABLED.cursor : BUTTON_STYLE_ENABLED.cursor)
    }}
    onClick={() => {
      if (a.disabled) {
        console.log(a.disabled)
      } else {
        a.action()
      }
    }}>
      <div style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderStyle: "solid",
        borderRadius: 4,
        zIndex: 3,
        borderColor: (a.disabled ? BUTTON_STYLE_DISABLED.borderColor : BUTTON_STYLE_ENABLED.borderColor)
      }}/>
      <div style={{
        borderRadius: 4,
        zIndex: 3,
        ...(a.disabled ? BUTTON_STYLE_DISABLED : BUTTON_STYLE_ENABLED)
      }}>

          

        {
          a.timeout != undefined && a.timeoutLeft != undefined && <div style={{
            zIndex: 2,
            position: "absolute",
            backgroundColor: "white",
            opacity: 0.9,
            width: (100 * a.timeoutLeft / a.timeout ) + "%",
            height: "100%",
          }}/>
        }
        <div style={{
          position: "relative",
          zIndex: 1,
          padding: 3,
        }}>
          {a.title}
        </div>
      </div>
  </div>
