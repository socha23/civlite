import React, { PropsWithChildren, ReactNode } from 'react';

import { GameModel } from '../model/gameModel';
import { Action } from '../model/action'
import { CostElem } from '../model/costs';
import { Colors, FontSizes, Icons, Labels, DividerColors } from './icons';

type ActionCost = {
  cost: CostElem
  canPay: boolean
}

interface ActionParms {
  title?: string,
  buttonLabel?: string
  description?: ReactNode | string
}

export interface ActionProps extends ActionParms {
  action: () => void
  costs: ActionCost[]
  timeout?: number
  timeoutLeft?: number
  disabled?: any
}


export function propsForAction(model: GameModel, a: Action, params: ActionParms = {}): ActionProps {
  return {
    ...params,
    action: () => a.onAction(model),
    costs: a.costs.map(c => ({cost: c, canPay: model.canPay(c)})),
    timeout: a.timeout, 
    timeoutLeft: a.timeoutLeft,
    disabled: a.disabled(model)
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
  borderColor: "#ddd",
  backgroundColor: "#fff",
  cursor: "not-allowed",
}

export const _ActionButton = (a: PropsWithChildren<ActionProps>) =>
  <div style={{
      zIndex: 0,
      width: "100%",
      height: "100%",
    position: "relative",
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
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 4,
        zIndex: 3,
        borderColor: (a.disabled ? BUTTON_STYLE_DISABLED.borderColor : BUTTON_STYLE_ENABLED.borderColor)
      }}/>
      <div style={{
        borderRadius: 4,
        zIndex: 3,
        height: "100%",
        width: "100%",
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
          height: "100%",
          width: "100%",
          zIndex: 1,
          padding: 3,
        }}>{a.children}</div>
      </div>
  </div>



export const ActionButton = (a: ActionProps) => <_ActionButton {...a}>
 <div style={{
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: 4}}>
    <div>{a.title}</div>
    <ActionCostRow costs={a.costs}/>
 </div>
</_ActionButton>

export const SmallIconButton = (a: ActionProps) => <div style={{
  width: 16,
  height: 16,
}}>
  <_ActionButton {...a}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <i style={{fontSize: 8}} className='fa-solid fa-plus'/>
    </div>
    
  </_ActionButton>
</div>

export const ActionCostRow = (p: {costs: ActionCost[]}) => <div style={{
  display: 'flex',
  gap: 4,
  fontSize: FontSizes.small,
}}>
  {p.costs.map((c, idx) => <div key={idx} style={{
      display: "flex",
      color: c.canPay ? Colors.default : Colors.grayedOut,
      gap: 2,
    }}>
      <div>{c.cost.count}</div>
      <div style={{
      }}><i className={Icons[c.cost.type]}/></div>
    </div>)}
</div>


export const ActionRow = (p: ActionProps) => <div className="dottedDividers" style={{
  display: "flex",
  borderColor: DividerColors.light,
  fontSize: FontSizes.small,
  flexDirection: "column",
  paddingTop: 8,
  paddingBottom: 8,
}}>
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 4,
  }}>
    <div style={{
      width: 120,
    }}>
      <ActionButton {...p} title={p.title}/>
    </div>
    <div style={{
      width: 120,
    }}>
    </div>
  </div>
  
</div>
