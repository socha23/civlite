import React, {createContext, useContext, useState} from 'react';
import { BUTTON_STYLE, BUTTON_STYLE_ENABLED } from './action';
import { Icons } from './icons';
import { useSpring, animated } from '@react-spring/web';
import { CoordsCatcher, getCoords } from './elementCoordinatesHolder';

type SwitchPanelProps = { children?: React.ReactNode }

type SwitchContextType= {
  expanded: boolean,
  setExpanded: (expanded: boolean) => void
}

const SwitchContext = createContext<SwitchContextType>({
  expanded: true,
  setExpanded: () => {}
})

export const SwitchParent = ({children}: SwitchPanelProps) => {
  const [expanded, setExpanded] = useState(true)
  return <div>
      <SwitchContext.Provider value={{
        expanded: expanded,
        setExpanded: setExpanded
      }}>
    {children}
    </SwitchContext.Provider>
  </div>
}

export const SwitchExpandToggle = () => {
  const context = useContext(SwitchContext) 
  return <div style={{
    ...BUTTON_STYLE,
    ...BUTTON_STYLE_ENABLED,
    height: 16,
    width: 16,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",

  }}
    onClick={() => {context.setExpanded(!context.expanded)}}>
    <i className={context.expanded ? Icons.PanelHide : Icons.PanelExpand}/>
  </div>
} 

let autoinc = 0
function nextId() {
  return "_switchPanel" + (autoinc++)
}

export const SwitchPanel = (p: {id?: string, 
  children?: React.ReactNode}) => {
  const [id, _] = useState(p.id || nextId())
  const context = useContext(SwitchContext) 
  const [panelExpanded, setPanelExpanded] = useState(true)
  const [springs, springApi] = useSpring(() => ({
    from: {},
    to: {},
  }))
  const height = getCoords(id)?.height || 300
  if (!panelExpanded && context.expanded) {
    springApi.start({
      from: {height: 0},
      to: {height: height},
    })
    setPanelExpanded(true)
  } else if (panelExpanded && !context.expanded) {
    springApi.start({
      from: {height: height},
      to: {height: 0},
    })
    setPanelExpanded(false)
  }
  return <animated.div style={{
    overflow: "hidden",
    ...springs
  }}>
    {<CoordsCatcher id={id}>
        {p.children}
    </CoordsCatcher>}
  </animated.div>
} 
