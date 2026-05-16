import { useEffect, useState } from "react"
import { useOrderBook } from "../hooks/useOrderBook"
import {type ProcessedRow, type spreadMetrics } from "../types/orderBookTypes"
function OrderBookTable() {
  const [bids,setBids]=useState<ProcessedRow[]>([])
  const [asks,setAsks]=useState<ProcessedRow[]>([])
  const [midPrice,setMidPrice]=useState<number|null>(null)
  const [prevMid,setPrevMid]=useState<number|null>(null)
  const { rowData, spreadMetrics } = useOrderBook();
  useEffect(()=>{
    const bidRows = rowData.filter((item) => item.side === "bid");
    const askRows = rowData.filter((item) => item.side === "ask");
    const mid=spreadMetrics?.midPrice
    setPrevMid(midPrice)  
    if (mid !== undefined) {
    setMidPrice(mid)
    }
    setBids(bidRows);
    setAsks(askRows);
  },[rowData])

  return (
    <div className="">
      <h1 className='text-sm text-black/65'>OrderBook</h1>
      <div className='flex items-center columns-3 gap-24 text-xs text-black/55'>
        <h4>Price</h4>
        <h4>Volume()</h4>
        <h4>Total</h4>
      </div>
      <div className='flex items-center columns-3 gap-20 text-xs text-black/55'>
      <div>
        {bids.map((items)=>{
          return(
            <p className="text-red-500">{(items.price).toFixed(2)}</p>
          )
        })}
      </div>
      <div>
          {bids.map((items)=>{
          return(
            <p className="text-black-80">{(items.size).toFixed(5)}</p>
          )
        })}
      </div>
         <div >
          {bids.map((items)=>{
          return(
            <p className="text-black-80">{(items.total).toFixed(4)}</p>
          )
        })}
      </div> 
      </div>
      <p className={`py-4 ${(prevMid ?? 0) < (midPrice ?? 0) ? "text-green-500":"text-red-500"}`}>{midPrice?.toFixed(3)} <span className="text-xs text-black/35 px-4">${midPrice?.toFixed(2)}</span></p>
      <div className='flex items-center columns-3 gap-20 text-xs text-black/55'>
          <div>
             {asks.map((items)=>{
          return(
            <p className="text-green-500">{(items.price).toFixed(2)}</p>
          )
        })}
          </div>
          <div>
            {asks.map((items)=>{
          return(
            <p className="text-black-80">{(items.size).toFixed(5)}</p>
          )
        })}
          </div>
          <div>
           {asks.map((items)=>{
          return(
            <p className="text-black-80">{(items.total).toFixed(4)}</p>
          )
          })} 
          </div>
       </div>
    </div>
  )
}

export default OrderBookTable
