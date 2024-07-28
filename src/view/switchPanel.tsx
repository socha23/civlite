import React, {createContext, useContext, useState} from 'react';
import { BUTTON_STYLE, BUTTON_STYLE_ENABLED } from './action';
import { Icons } from './icons';

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


export const SwitchPanel = (p: {children?: React.ReactNode}) => {
  const context = useContext(SwitchContext) 
  return <div>
    {context.expanded && p.children}
  </div>
} 
