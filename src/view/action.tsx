import React, { CSSProperties, PropsWithChildren, ReactNode } from 'react';

import { GameModel } from '../model/gameModel';
import { Action, ActionState, unlazyRewards } from '../model/action'
import { Colors, FontSizes } from './icons';
import { AmountWithColorProps, Amounts } from './amount';
import { ActionCommonLabels } from './labels';
import { CoordsCatcher, coordsIdActionWrapper } from './coordsCatcher';
import { WithTooltip } from './tooltips';
import { playSound, SoundType } from './sounds';
import { FlashingBorderEffect, getEffects, RollupEffect } from './actionEffects';

interface ActionParms {
  title?: string,
  color?: string,
  buttonLabel?: ReactNode | string
  description?: ReactNode | string
}

export interface ActionProps extends ActionParms {
  id: string,
  disabled?: any
  state: ActionState

  action: () => void,
  cancel?: () => void,

  autoStartOnComplete?: boolean,
  setAutoStartOnComplete?: (a: boolean) => void,

  costs?: AmountWithColorProps[]
  workCost?: AmountWithColorProps[],
  workLeft?: AmountWithColorProps[],
  timeCost?: number,
  timeLeft?: number,
  
  completionRatio?: number

  rewards?: AmountWithColorProps[]
  
}

export function propsForAction(model: GameModel, a: Action, params: ActionParms = {}): ActionProps {
  return {
    id: a.id,
    action: () => a.onAction(model),
    cancel: a.cancellable ? () => a.onCancel(model) : undefined,
    autoStartOnComplete: a.autoStartOnComplete,
    setAutoStartOnComplete: (s) => {a.autoStartOnComplete = s},
    costs: a.initialCost(model).map(c => ({...c, color: model.canPay(c) ? Colors.default: Colors.UnsatisfiableCost})),
    workCost: a.workCost,
    workLeft: a.workLeft,
    timeCost: a.timeAcc.required ? a.timeAcc.required : undefined,
    timeLeft: a.timeAcc.missing, 
    rewards: unlazyRewards(a.expectedRewardsAtStart || a.expectedRewards, model).map(c => ({...c, color: Colors.default})),
    completionRatio: a.completionRatio, 
    disabled: a.disabled(model),
    state: a.state,
    color: a.color,
    ...params,
  }
}

export const BUTTON_STYLE = {
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: Colors.default,
  borderRadius: 4,
}

export const BUTTON_STYLE_ENABLED = {
  ...BUTTON_STYLE,
  color: "black",
  borderColor: "#666",
  backgroundColor: "#eee",
  cursor: "default",
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


const ActionRowProgressIndicator = (a: ActionProps) => {
  const amounts = a.workLeft ? [...a.workLeft] : []
  if (a.timeLeft) {
    amounts.push({count: a.timeLeft, postfix: ActionCommonLabels.Second})
  }
  return <div style={{
    display: "flex",
    gap: 4,
    width: 100,
  }}>
    {
      a.cancel && <ActionButton3Inner 
      id={a.id + "_cancel"}
      action={a.cancel}
      cancel={() => {}}
      state={ActionState.Ready}
      style={{
        paddingTop: 2,
        paddingLeft: 4,
        paddingBottom: 2,
        paddingRight: 4,
      }}
    >
      {ActionCommonLabels.Cancel}
    </ActionButton3Inner>

    }
    <div style={{flexGrow: 1}}/>

    <div style={{
        fontSize: FontSizes.normal,
        fontWeight: "bold",
      }}>
        <Amounts items={amounts} vertical={true}/>
    </div>
 </div>
  
  
 } 

export const ActionButton3 = (a: PropsWithChildren<ActionProps & {style?: CSSProperties}>) => <ActionButton3Inner {...a}>
    {a.buttonLabel || a.title}
</ActionButton3Inner>

const ActionButton3Inner = (a: PropsWithChildren<ActionProps & {style?: CSSProperties}>) => {
  const enabled = !a.disabled && (a.state === ActionState.Ready)
  const buttonStyle = enabled ? BUTTON_STYLE_ENABLED : BUTTON_STYLE_DISABLED
  return <div style={{
      ...buttonStyle,
      ...a.style,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
    }} onClick={() => {
      if (a.disabled) {
        console.log(a.disabled)
      } else if (enabled) {
        playSound(SoundType.Click)
        a.action()
      }
    }}>
      {a.children}
    </div>
}

const ActionRowStartActionButton = (a: ActionProps) => <ActionButton3Inner style={{
  width: 80,
  minHeight: 20,
}} {...a}>
   {a.buttonLabel || a.title}
</ActionButton3Inner>
  
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


type ActionRowParams = ActionProps & {
  inTooltip?: boolean,
  showButton?: boolean, 
  displayRewards?: boolean,
  displayCost?: boolean,
}

const InnerActionRow3 = (p: PropsWithChildren<ActionRowParams>) => {
  const costs = p.costs || []
  const work = p.workCost || []
  const rewards = p.rewards || []

  const displayCosts = costs.length > 0 && (p.displayCost === undefined || p.displayCost)
  const displayWork = work.length > 0 && (p.displayCost === undefined || p.displayCost)
  const displayRewards = rewards.length > 0 && (p.displayRewards === undefined || p.displayRewards)

  const displayAmountsRow = displayCosts || displayRewards || displayWork || p.timeCost

  return <div style={{
    display: "flex",
    flexDirection: "column",
    padding: 2,
    gap: 4,
  }}>
    <div style={{
      display: "flex",
    }}>
      <div style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
      }}>
        <ActionRowTitle {...p}/>
        {
          (displayAmountsRow) &&
          <div style={{
            display: "flex",
            gap: 8,
          }}>
            {p.timeCost && <ActionRowsAmountsRow items={[{count: p.timeCost, postfix: ActionCommonLabels.Second}]} label={ActionCommonLabels.Time}/>}
            {displayWork && <Amounts items={work}/>}
            {displayCosts && <ActionRowsAmountsRow items={costs} label={ActionCommonLabels.Cost}/>}
            {displayRewards && <ActionRowsAmountsRow items={rewards} label={ActionCommonLabels.Rewards}/>}
          </div>
        }
      </div>
      <CoordsCatcher id={p.id}>
        {p.showButton && (p.state === ActionState.InProgress ? <ActionRowProgressIndicator {...p}/> : <ActionRowStartActionButton {...p}/>)}
      </CoordsCatcher>
    </div>
    <div>
      {p.description}
    </div>
    {
      p.children && <div>{p.children}</div>
    }
  </div>
}

export const ActionRow3 = (p: PropsWithChildren<ActionRowParams>) => { 
  const paramsColor = p.color || Colors.active
  const inProgressColor = p.state === ActionState.InProgress ? paramsColor : "transparent"
  
  const wrapperStyle: CSSProperties = {
    boxShadow: "",
    borderColor: inProgressColor,
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: p.inTooltip ? 0 : 6,
    fontSize: FontSizes.small,
    overflow: "clip",
  }
  const innerWrapperStyle: CSSProperties = {
    boxShadow: "",
  }

  getEffects(p.id).forEach(effect => {
    if (effect instanceof FlashingBorderEffect) {
      wrapperStyle.boxShadow = `0 0 ${effect.animation.value("flashRadius")}px ${paramsColor}`
      wrapperStyle.borderColor = paramsColor
      innerWrapperStyle.boxShadow = `inset 0 0 ${effect.animation.value("flashRadius")}px ${paramsColor}`
    }
    if (effect instanceof RollupEffect) {
      wrapperStyle.height = effect.animation.value("height")
    }
  })

  return <div style={wrapperStyle}>
    <CoordsCatcher id={coordsIdActionWrapper(p.id)}>
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%",
      ...innerWrapperStyle,
    }}>
      <div style={{
        position: "absolute",
        zIndex: 1,
        width: (100 * (p.completionRatio || 0)) + "%",
        height: "100%",
        backgroundColor: inProgressColor,
      }}/>
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: 2,
      }}>        
          <InnerActionRow3 showButton={!p.inTooltip} {...p}/>        
      </div>
    </div>
    </CoordsCatcher>  
    
  </div>
}

export const SmallButtonAction = (p: ActionProps) => <WithTooltip tooltip={
  <ActionRow3 {...p} inTooltip={true} displayRewards={true}/>
}>
  <ActionButton3Inner {...p} style={{
    width: 16,
    height: 16,
    borderRadius: 4,
    fontSize: FontSizes.small,
  }}>  
    {p.buttonLabel}
  </ActionButton3Inner>
</WithTooltip>


export const CheckBox = (p: {value: boolean, setValue: (b: boolean) => void}) => <div 
  onClick={e => {
    p.setValue(!p.value)
  }}
  style={{
    width: 20,
    height: 20,
    fontSize: 20,
  }}
>
  <i className={p.value ? 'fa-regular fa-square-check' : 'fa-regular fa-square'}/>
</div>

export const AutostartSection = (p: PropsWithChildren<ActionProps>) => <div style={{
  display: "flex",
  gap: 4,
  alignItems: "center"
}}>
  <div>{p.children}</div>
  {p.autoStartOnComplete !== undefined && p.setAutoStartOnComplete !== undefined 
    && <CheckBox value={p.autoStartOnComplete!!} setValue={b => {p.setAutoStartOnComplete!!(b)}}/>
  }
</div>