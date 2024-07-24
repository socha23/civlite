import React from 'react';

import { Amount, ExpectedAmount, ItemType } from '../model/amount';
import { Colors, FontSizes, Icons } from './icons';
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
