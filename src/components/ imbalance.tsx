import { useEffect, useState } from "react"
import {type ProcessedRow } from "../types/orderBookTypes"
import { useOrderBook } from "../hooks/useOrderBook"

function Sparkline() {
    const [bidTotal,setBidTotal]=useState<number>(0)
    const [askTotal,setAskTotal]=useState<number>(0)
    const [total,setTotal]=useState<number>(0)
    const {rowData}=useOrderBook()

    useEffect(()=>{ 
    rowData.map((items)=>{
      items.side == 'bid' ? setBidTotal((p)=>p+items.size) : setAskTotal((p)=>p+items.size)
      setTotal((p)=>p+items.size)
    })
    },[rowData])    
    const bidPercent=(bidTotal/total)*100
    const askPercent=(askTotal/total)*100
    console.log(bidPercent)
    console.log(askPercent)
  return (
   <div className="w-full flex items-center">
    <p className="text-sm flex">B<span className="text-green-500 ">{bidPercent.toFixed(2)}%</span></p>
    <div
      className="bg-green-500 h-1"
      style={{ width: `${bidPercent}%` }}
    />
    <div
      className="bg-red-500 h-1"
      style={{ width: `${askPercent}%` }}
    />
    <p className="text-sm flex"><span className="text-red-500">{askPercent.toFixed(2)}%</span> S</p>
  </div>
  )
}

export default Sparkline
