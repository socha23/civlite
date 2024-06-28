import React, { ReactNode } from 'react';
import { Log } from '../model/log';


export type MessageProps = {
  message: ReactNode,
  idx: number,
}


export type LogProps = {
  messages: MessageProps[],

}

export function logProps(log: Log): LogProps {
  return {
    messages: log.messages,
  }
}

export const LogView = (p: LogProps) => <div style={{
  display: "flex",
  flexDirection: "column",
}}>
  {p.messages.map((m, idx) => <div key={m.idx}>
    {m.message}
  </div>
  
  )}
</div>