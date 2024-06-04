import React from 'react';
import { DividerColors } from './icons';

type BoxProps = { children?: React.ReactNode }



export const Box = ({children}: BoxProps) =>
  <div className="dividers" style={{
    borderWidth: 1,
    width: 250,
    borderColor: DividerColors.mid,
  }}>
    {children}
  </div>
