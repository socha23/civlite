import React from 'react';

export type ActionProps = {
  title: string
  action: () => void
  disabled?: any
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
      padding: 3,
      borderWidth: 1,
      borderStyle: "solid",
      margin: 3,
      borderRadius: 4,
      userSelect: "none",
      ...(a.disabled ? BUTTON_STYLE_DISABLED : BUTTON_STYLE_ENABLED)
    }}
    onClick={() => {
      if (a.disabled) {
        console.log(a.disabled)
      } else {
        a.action()
      }
    }}>
    {a.title}
  </div>
