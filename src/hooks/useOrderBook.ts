import { useEffect,useRef,useState } from "react";
import { type ProcessedRow, type orderBookSnapshot, type spreadMetrics } from "../types/orderBookTypes";
import { mockData} from "../utils/mockData";
export function useOrderBook(){
    const [rowData,setRowData]=useState<ProcessedRow[]>([])
    const [spreadMetrics,setSpreadMetrics]=useState<spreadMetrics|null>()
    const prevSnap=useRef<orderBookSnapshot|null>(null)
    useEffect(() => {
    const interval = setInterval(() => {
    const data=mockData();
    let bidTotalSize=0
    let askTotalSize=0
    let depth=0
    let bidTotal=0
    let askTotal=0
    // Processd Row
    data?.bids.map(({size})=>{
        bidTotalSize+=size
    })
    data?.ask.map(({size})=>{
        askTotalSize+=size
    })

    const bidRows: ProcessedRow[] =data?.bids.map(({price,size},index)=>{
        bidTotal+=size
        depth = prevSnap.current?.bids[index].size==null ? 0 :(bidTotal/bidTotalSize)*100
        let flash:"up" | "down" | "none"= prevSnap.current?.bids[index].size==null ? 'none' : prevSnap.current.bids[index].size < size ? "up" : "down" 
         return {
        price,
        size,
        total: bidTotal,
        depth,
        side: "bid",
        flash
    };
    })?? []
    const askRows: ProcessedRow[] =data?.ask.map(({price,size},index)=>{
        askTotal+=size
        depth = prevSnap.current?.ask[index].size==null ? 0 :(askTotal/askTotalSize)*100
        let flash:"up" | "down" | "none"= prevSnap.current?.ask[index].size==null ? 'none' : prevSnap.current.ask[index].size < size ? "up" : "down" 
         return {
        price,
        size,
        total: askTotal,
        depth,
        side: "ask",
        flash
    };
    })?? []
    setRowData([...bidRows, ...askRows])
    prevSnap.current=data
    // Spread Matrice
    let spread=(data?.ask[0]?.price ?? 0) - (data?.bids[0]?.price ?? 0)
    let midPrice =((data?.ask[0]?.price ?? 0)+(data?.bids[0]?.price ?? 0))/2
    let spreadBps=(spread / midPrice) * 10000
    setSpreadMetrics({
        bestBid:(data?.bids[0]?.price ?? 0),
        bestAsk:(data?.ask[0]?.price ?? 0),
        spread,
        spreadBps,
        midPrice
})
        }, 1000);
        return () => clearInterval(interval);
    }, []
);  
    return {rowData,spreadMetrics}
}
