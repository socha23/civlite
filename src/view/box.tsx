import React from 'react';

type BoxProps = { children?: React.ReactNode }

export const Box = ({children}: BoxProps) =>
  <div style={{
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
    padding: 10
  }}>
    {children}
  </div>
