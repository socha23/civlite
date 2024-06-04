import React from 'react';
import { FontSizes, TrendColors } from './icons';

export type LineProps = {
  icon: string,
  label: string,
  count: number
  cap?: number
  trend?: number
}

export const ResourceTrend = (p: {delta: number}) => p.delta === 0 ? <span/> : <span style={{
  color: p.delta > 0 ? TrendColors.positive: TrendColors.negative
}}>{p.delta > 0 ? "+" : "-"}{p.delta.toFixed(1)}</span>

export const Line = (p: {icon?: string, label: string, count: number, cap?: number, trend?: number }) => <div 
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
    }}>{p.count.toFixed()}</div>
  <div style={{
    width: 40,
    }}>{!p.cap ? "" : "/ " + p.cap.toFixed()}</div>
  <div style={{
    fontSize: FontSizes.small,
    width: 40,
    textAlign: "right",
  }}>{!p.trend ? "" : <ResourceTrend delta={p.trend}/>}</div>
</div>
