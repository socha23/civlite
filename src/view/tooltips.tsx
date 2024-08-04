import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import { createPortal } from 'react-dom';
import { Colors } from './icons';
import { getMouseY, getMouseX } from './mouseCatcher';
import { CoordsCatcher, getCoords } from './coordsCatcher';

type TooltipContextType = {
  node?: HTMLDivElement,
}

const TooltipContext = createContext<TooltipContextType>({
  node: undefined,
})

export const TooltipOverlay = () => {
  const ref = useRef<HTMLDivElement>(null)
  const ctx = useContext(TooltipContext)
  
  useEffect(() => {
    if (ref.current) {
      ctx.node = ref.current
    }
  })

  return <div ref={ref} style={{
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 20,
  }}>
  </div>
}

let autoinc = 0
function nextId() {
  return "_tooltip" + (autoinc++)
}

export const Tooltip = (p: {id: string, children?: React.ReactNode}) => {
  const coords = getCoords(p.id)
  if (!coords) {
      return <div/>
  }
  return <div style={{
    position: "absolute",
    top: coords.bottom + 10,
    left: coords.left + 10,
    zIndex: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.default,
    borderStyle: "solid", 
  }}>
    {p.children}
  </div>
}

export const WithTooltip = (p: {id?: string, 
  tooltip: React.ReactNode,
  children?: React.ReactNode}) => {
    const [shown, setShown] = useState(false)
    const ctx = useContext(TooltipContext)
    const [id, _] = useState(p.id || nextId())
    
    return <div
      onMouseEnter={() => {
        setShown(true)
      }}
      onMouseLeave={() => {
        setShown(false)
      }}
    >
      <CoordsCatcher id={id}>
        {p.children}
      </CoordsCatcher>
      { shown && ctx.node && createPortal(<Tooltip id={id}>{p.tooltip}</Tooltip>, ctx.node)}
    </div>
} 
