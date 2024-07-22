import React, { ReactNode, useRef, useState } from 'react';
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

export const LogView = (p: LogProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lastMsg, setLastMsg] = useState(0)
  if (p.messages.length > 0) {
    const currentLastIdx = p.messages[p.messages.length - 1].idx
    if (lastMsg != currentLastIdx) {
      setLastMsg(currentLastIdx)
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.lastElementChild?.scrollIntoView()
        }
      })
    }
  }
  
  return <div ref={containerRef} style={{
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "auto",
    gap: 4,
  }}>
    {p.messages.map((m, idx) => <div key={m.idx}>
      {m.message}
    </div>
    
    )}
  </div>
}