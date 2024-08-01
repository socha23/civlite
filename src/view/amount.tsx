import React from 'react';

import { Amount, ExpectedAmount, ItemType } from '../model/amount';
import { Colors, FontSizes, Icons, TrendColors } from './icons';
import { formatNumber } from '../model/utils';

export type RawNumber = {
  count: number
}

export type AmountWithColorProps = (Amount | ExpectedAmount | RawNumber) & {
  color?: string
  postfix?: string

}

export const AmountView = (p: AmountWithColorProps) => <div style={{
  color: p.color || Colors.default,
  display: "flex",
  gap: 2
}}>
  <div>{"count" in p ? formatNumber(p.count, 1) : p.from + "-" + p.to}{p.postfix}</div>
  {"type" in p && <i className={Icons[p.type]}/>}
</div>

export const Amounts = (p: {items: AmountWithColorProps[], vertical?: boolean}) => <div style={{
  display: 'flex',
  flexDirection: p.vertical ? "column" : "row",
  gap: 4,
}}>
  {p.items.map((c, idx) => <AmountView key={idx} {...c}/>)}
</div>


export const PercentageModifier = (p: {value: number}) => {
  let color = Colors.default
  let value = "+0%"

  if (p.value > 1) {
    value = "+" + Math.floor((p.value - 1) * 100) + "%"
    color = Colors.Positive
  } 

  if (p.value < 1) {
    value = "-" + Math.floor((1 - p.value) * 100) + "%"
    color = Colors.Warning
  }
  

  return <span style={{
    color: color
  }}>
    {value}
  </span>
}
