import React, { PropsWithChildren, ReactNode } from 'react';

import { GameModel } from '../model/gameModel';
import { Action, ActionState } from '../model/action'
import { Colors, FontSizes, DividerColors } from './icons';
import { AmountWithColorProps, Amounts } from './amount';
import { ActionCommonLabels } from './labels';
import { CoordsCatcher } from './elementCoordinatesHolder';

interface ActionParms {
  title?: string,
  buttonLabel?: ReactNode | string
  description?: ReactNode | string
}

export interface ActionProps extends ActionParms {
  id: string,
  action: () => void,
  costs?: AmountWithColorProps[]
  workCost?: AmountWithColorProps[],
  workLeft?: AmountWithColorProps[],
  timeCost?: number,
  timeLeft?: number,
  rewards?: AmountWithColorProps[]
  disabled?: any
  completionRatio?: number
  state: ActionState
  description?: ReactNode | string
}

export function propsForAction(model: GameModel, a: Action, params: ActionParms = {}): ActionProps {
  return {
    id: a.id,
    action: () => a.onAction(model),
    costs: a.initialCost.map(c => ({...c, color: model.canPay(c) ? Colors.default: Colors.UnsatisfiableCost})),
    workCost: a.workCost,
    workLeft: a.workLeft,
    timeCost: a.timeAcc.required ? a.timeAcc.required : undefined,
    timeLeft: a.timeAcc.missing, 
    rewards: a.rewards.map(c => ({...c, color: Colors.default})),
    completionRatio: a.completionRatio, 
    disabled: a.disabled(model),
    state: a.state,
    ...params,
  }
}

const BUTTON_STYLE = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: Colors.default,
  borderRadius: 4,
}

const BUTTON_STYLE_ENABLED = {
  ...BUTTON_STYLE,
  color: "black",
  borderColor: "#666",
  backgroundColor: "#eee",
  cursor: "pointer",
}

const BUTTON_STYLE_DISABLED = {
  ...BUTTON_STYLE,
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
    {a.costs && <Amounts items={a.costs}/>}
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



const ActionRowProgressIndicator = (a: ActionProps) => {
  const amounts = a.workLeft ? [...a.workLeft] : []
  if (a.timeLeft) {
    amounts.push({count: a.timeLeft, postfix: ActionCommonLabels.Second})
  }
  return <div style={{
    fontSize: FontSizes.normal,
    fontWeight: "bold",
  }}>
      <Amounts items={amounts} vertical={true}/>
  </div>
} 


const ActionRowStartActionButton = (a: ActionProps) => {
  const enabled = !a.disabled && (a.state === ActionState.Ready)
  const buttonStyle = enabled ? BUTTON_STYLE_ENABLED : BUTTON_STYLE_DISABLED
  return <CoordsCatcher id={a.id}>  
    <div style={{
      ...buttonStyle,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      userSelect: "none",
    }} onClick={() => {
      if (a.disabled) {
        console.log(a.disabled)
      } else if (enabled) {
        a.action()
      }
    }}>
      {a.buttonLabel || a.title}
    </div>
  </CoordsCatcher>
}

const ActionRowTitle = (p: ActionProps) => <div style={{
  fontWeight: "bold",
}}>
  {p.title}
</div>


const ActionRowsAmountsRow = (p: {label: string, items: AmountWithColorProps[]}) => <div style={{
  display: "flex",
  gap: 4,
}}>
  <div>{p.label}</div>
  <Amounts items={p.items}/>
</div>

const _ActionRow3 = (p: ActionProps & {displayRewards?: boolean}) => {
  const costs = p.costs || []
  const work = p.workCost || []

  const totalCostAmounts = [...costs, ...work] as AmountWithColorProps[]
  const totalRewardAmounts = p.rewards ? p.rewards : []

  return <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 4,
  }}>
    <div style={{
      display: "flex",
      height: 24,
    }}>
      <div style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}>
        <ActionRowTitle {...p}/>
        {
          (totalCostAmounts.length > 0 || totalRewardAmounts.length > 0) &&
          <div style={{
            display: "flex",
            gap: 8,
          }}>
            {p.timeCost && <ActionRowsAmountsRow items={[{count: p.timeCost, postfix: ActionCommonLabels.Second}]} label={ActionCommonLabels.Time}/>}
            {totalCostAmounts.length > 0 && <ActionRowsAmountsRow items={totalCostAmounts} label={ActionCommonLabels.Cost}/>}
            {p.rewards && p.rewards.length > 0 && p.displayRewards && <ActionRowsAmountsRow items={p.rewards} label={ActionCommonLabels.Rewards}/>}
          </div>
        }
      </div>
      {p.state === ActionState.InProgress ? <ActionRowProgressIndicator {...p}/> : <ActionRowStartActionButton {...p}/>}
    </div>
    <div>
      {p.description}
    </div>
  </div>
}

export const ActionRow3 = (p: ActionProps & {displayRewards?: boolean}) => <div style={{
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: p.state === ActionState.InProgress ? Colors.active : "transparent",
    borderRadius: 6,
  }}>
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
    }}>
      <div style={{
        position: "absolute",
        zIndex: 1,
        width: (100 * (p.completionRatio || 0)) + "%",
        height: "100%",
        backgroundColor: p.state === ActionState.InProgress ? Colors.active : "transparent",
      }}/>
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: 2,
      }}>
        <_ActionRow3 {...p}/>
      </div>
      
    </div>
  </div>
