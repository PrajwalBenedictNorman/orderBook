import { useEffect } from "react"
import {type spreadMetrics } from "../types/orderBookTypes"
interface Props{
    rows:spreadMetrics
}
function SpreadMatrice({rows}:Props) {

  return (
    <div>
      <div className="flex gap-2 columns-5">
        <p>Best Bid</p>
        <p>Best Ask</p>
        <p>Spread</p>
        <p>Spread BPS</p>
        <p>Mid Price</p>
      </div>
      <div className="flex gap-3 columns-5">
        <p>{rows.bestBid.toFixed(2)}</p>
        <p>{rows.bestAsk.toFixed(2)}</p>
        <p>{rows.spread.toFixed(2)}</p>
        <p>{rows.spreadBps.toFixed(2)}</p>
        <p>{rows.midPrice.toFixed(2)}</p>

      </div>

    </div>
  )
}

export default SpreadMatrice
