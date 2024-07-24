import React, { PropsWithChildren } from 'react';
import { FontSizes, TrendColors } from './icons';
import { formatNumber } from '../model/utils';

export type LineProps = {
  icon: string,
  label: string,
  value: number
  max?: number
  trend?: number
}

export const Column = (p: PropsWithChildren<{}>) => <div style={{
  display: "flex",
  flexDirection: "column",
  gap: 4,
}}>
  {p.children}
</div>

export const Row = (p: PropsWithChildren<{}>) => <div style={{
  display: "flex",
  gap: 4,
}}>
  {p.children}
</div>

export const ResourceTrend = (p: {delta: number}) => p.delta === 0 ? <span/> : <span style={{
  color: p.delta > 0 ? TrendColors.positive: TrendColors.negative
}}>{p.delta > 0 ? "+" : ""}{p.delta.toFixed(1)}</span>

export const Line = (p: {icon?: string, label: string, value: number, max?: number, trend?: number }) => <div 
className="line"
style={{
  display: "flex",
  alignItems: "center",
  gap: 4,
}}>
  <div style={{
    width: 20,
    textAlign: "center",
  }}>{p.icon && <i className={p.icon}/>}</div>
  <div style={{
    flexGrow: 1,
    }}>{p.label}</div>
  <div style={{
    flexGrow: 1,
    textAlign: "right",
    }}>{formatNumber(p.value)}</div>
  <div style={{
    width: 40,
    }}>{!p.max ? "" : "/ " + p.max.toFixed()}</div>
  <div style={{
    fontSize: FontSizes.small,
    width: 40,
    textAlign: "right",
  }}>{!p.trend ? "" : <ResourceTrend delta={p.trend}/>}</div>
</div>
