import React, { PropsWithChildren, ReactNode } from 'react';

import { GameModel } from '../model/gameModel';
import { Action, ActionState } from '../model/action'
import { Colors, FontSizes, DividerColors } from './icons';
import { AmountWithColorProps, Amounts } from './amount';

interface ActionParms {
  title?: string,
  buttonLabel?: ReactNode | string
  description?: ReactNode | string
}

export interface ActionProps extends ActionParms {
  action: () => void
  costs: AmountWithColorProps[]
  disabled?: any
  completionRatio?: number
  state?: ActionState
}

export function propsForAction(model: GameModel, a: Action, params: ActionParms = {}): ActionProps {
  return {
    action: () => a.onAction(model),
    costs: a.initialCost.map(c => ({...c, color: model.canPay(c) ? Colors.default: Colors.UnsatisfiableCost})),
    completionRatio: a.completionRatio, 
    disabled: a.disabled(model),
    state: a.state,
    ...params,
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

const ActionButtonInner = (a: PropsWithChildren<ActionProps>) =>
  <div style={{
      zIndex: 0,
      width: "100%",
      height: "100%",
    position: "relative",
      userSelect: "none",
      cursor: (a.disabled || a.state === ActionState.InProgress ? BUTTON_STYLE_DISABLED.cursor : BUTTON_STYLE_ENABLED.cursor)
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
          (a.completionRatio && a.completionRatio !== 1) ? <div style={{
            zIndex: 2,
            position: "absolute",
            backgroundColor: "white",
            opacity: 0.9,
            width: (100 * a.completionRatio ) + "%",
            height: "100%",
          }}/> : <span/>
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



export const ActionButton = (a: ActionProps) => <ActionButtonInner {...a}>
 <div style={{
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    gap: 4}}>
    <div>{a.buttonLabel || a.title}</div>
    <Amounts items={a.costs}/>
 </div>
</ActionButtonInner>

export const SmallIconButton = (a: ActionProps) => <div style={{
  width: 16,
  height: 16,
}}>
  <ActionButtonInner {...a}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <i style={{fontSize: 8}} className='fa-solid fa-plus'/>
    </div>
    
  </ActionButtonInner>
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

export const ActionRow2 = (p: PropsWithChildren<ActionProps>) => <div style={{
    paddingTop: 4,
    paddingBottom: 4,
    display: "flex",
    alignItems: "center",
    gap: 4,
  }}>
    <div style={{
      flexGrow: 1,
    }}>
      {p.children}
    </div>
    <div style={{
      width: 80,
    }}>
      <ActionButton {...p} title={p.title}/>
    </div>
  </div>
 

