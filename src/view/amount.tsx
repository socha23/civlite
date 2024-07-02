import React, { PropsWithChildren, ReactNode } from 'react';

import { Amount, ExpectedAmount } from '../model/amount';
import { Colors, FontSizes, Icons } from './icons';

export type AmountWithColorProps = (Amount | ExpectedAmount) & {
  color?: string
}

export const AmountView = (p: AmountWithColorProps) => <div style={{
  color: p.color || Colors.default,
  display: "flex",
  gap: 2
}}>
  <div>{"count" in p ? p.count : p.from + "-" + p.to}</div>
  <i className={Icons[p.type]}/>
</div>


export const Amounts = (p: {items: AmountWithColorProps[]}) => <div style={{
  display: 'flex',
  gap: 4,
  fontSize: FontSizes.small,
}}>
  {p.items.map((c, idx) => <AmountView key={idx} {...c}/>)}
</div>

