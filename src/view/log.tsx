import React from 'react';
import { Log } from '../model/log';


export type LogProps = {
  messages: string[],
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
  {p.messages.map((m, idx) => <div>
    {m}
  </div>
  
  )}
</div>