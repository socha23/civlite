import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { PopType } from '../model/pops';
import { ResourceType } from '../model/resources';

type Coords = DOMRect

const coordsMap = new Map<string, Coords>()

const BUFFER_SIZE = 1000

const ids = [] as string[]
let idx = 0

for (let i = 0; i < BUFFER_SIZE; i++) {
  ids.push("")
}





export function registerCoords(id: string, coords: Coords) {
  if (coordsMap.has(id)) {
    coordsMap.set(id, coords)
    return
  }
  const prevId = ids[idx]
  coordsMap.delete(prevId)
  ids[idx] = id
  coordsMap.set(id, coords)
  idx++
}

export function getCoords(id: string): Coords | undefined {
  return coordsMap.get(id)
}

export const CoordsCatcher = (p: PropsWithChildren<{id: string}>) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      registerCoords(p.id, ref.current.getBoundingClientRect())
    }  
  })
  return <div ref={ref}>{p.children}</div>
}

export function coordsIdPopCount(t: PopType) {
  return `pop_count_${t}`
}

export function coordsIdHuntStock(t: ResourceType) {
  return `hunting_stock_${t}`
}