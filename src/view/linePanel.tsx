import React, { PropsWithChildren, ReactNode } from 'react';
import { FontSizes, TrendColors } from './icons';
import { formatNumber } from '../model/utils';
import { SwitchExpandToggle, SwitchPanel, SwitchParent } from './switchPanel';

export const LinePanel = (p: PropsWithChildren<{
  icon?: string,
  label: string,
  value: number,
  postfix?: ReactNode,
}>) => <SwitchParent>
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
        <div style={{
          width: 20,
          textAlign: "center",
        }}>{p.icon && <i className={p.icon} />}</div>
        <div style={{
          flexGrow: 1,
        }}>{p.label}</div>
        <div style={{
          flexGrow: 1,
          textAlign: "right",
        }}>{formatNumber(p.value)}</div>
        <div style={{
          width: 64,
        }}>{p.postfix}</div>
        <SwitchExpandToggle/>
      </div>
      <SwitchPanel>
        {p.children}
      </SwitchPanel>
    </div></SwitchParent>



