import type { ProcessedRow } from "../types/orderBookTypes"
import { useRef, useEffect } from "react";

interface Props {
  rows: ProcessedRow[]
}

function DepthChart({ rows }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 1000;
    const H = 300;
    canvas.width = W;
    canvas.height = H;
    const PADDING = 40;

    const bids = rows.filter(r => r.side === "bid").sort((a, b) => b.price - a.price);
    const asks = rows.filter(r => r.side === "ask").sort((a, b) => a.price - b.price);
    if (!bids.length || !asks.length) return;

    let bidCum = 0;
    const bidPoints = bids.map(r => { bidCum += r.size; return { price: r.price, cum: bidCum }; });
    let askCum = 0;
    const askPoints = asks.map(r => { askCum += r.size; return { price: r.price, cum: askCum }; });
    const maxCum = Math.max(bidCum, askCum);

    const midPrice = (bids[0].price + asks[0].price) / 2;
    const bidSpread = midPrice - bids[bids.length - 1].price;
    const askSpread = asks[asks.length - 1].price - midPrice;
    const priceRange = Math.max(bidSpread, askSpread);
    const minPrice = midPrice - priceRange;
    const maxPrice = midPrice + priceRange;

    const toX = (price: number) => ((price - minPrice) / (maxPrice - minPrice)) * W;
    const toY = (cum: number) => H - PADDING - ((cum / maxCum) * (H - PADDING * 2));
    const toPrice = (x: number) => minPrice + (x / W) * (maxPrice - minPrice);
    const midX = toX(midPrice);

    function draw(mouseX?: number) {
      if(!ctx) return
      ctx.clearRect(0, 0, W, H);

      // Bids
      ctx.beginPath();
      ctx.moveTo(midX, H);
      ctx.lineTo(midX, toY(bidPoints[0].cum));
      bidPoints.forEach((p, i) => {
        ctx.lineTo(toX(p.price), toY(p.cum));
        if (i < bidPoints.length - 1) ctx.lineTo(toX(p.price), toY(bidPoints[i + 1].cum));
      });
      ctx.lineTo(toX(bidPoints[bidPoints.length - 1].price), H);
      ctx.closePath();
      ctx.fillStyle = "rgba(22,101,52,0.25)";   // dark green fill
      ctx.fill();
      ctx.strokeStyle = "#15803d"; 
      ctx.lineWidth = 2;
      ctx.stroke();

      // Asks
      ctx.beginPath();
      ctx.moveTo(midX, H);
      ctx.lineTo(midX, toY(askPoints[0].cum));
      askPoints.forEach((p, i) => {
        ctx.lineTo(toX(p.price), toY(p.cum));
        if (i < askPoints.length - 1) ctx.lineTo(toX(p.price), toY(askPoints[i + 1].cum));
      });
      ctx.lineTo(toX(askPoints[askPoints.length - 1].price), H);
      ctx.closePath();
      ctx.fillStyle = "rgba(220,38,38,0.15)";
      ctx.fill();
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mid line
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, H);
      ctx.strokeStyle = "#b91c1c"; 
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(127,29,29,0.25)";   // dark red fill
      ctx.font = "11px monospace";
      ctx.fillText(`$${midPrice.toFixed(2)}`, midX + 6, 16);

      // Crosshair + tooltip
      if (mouseX !== undefined) {
        const hoverPrice = toPrice(mouseX);
        const isBid = mouseX < midX;

        // Find cumulative amount at hover price
        let hoverCum = 0;
        if (isBid) {
          const point = bidPoints.find(p => p.price <= hoverPrice);
          hoverCum = point ? point.cum : 0;
        } else {
          const point = askPoints.find(p => p.price >= hoverPrice);
          hoverCum = point ? point.cum : 0;
        }

        const hoverY = toY(hoverCum);
        const rangePct = ((Math.abs(hoverPrice - midPrice) / midPrice) * 100).toFixed(2);

        // Vertical crosshair line
        ctx.beginPath();
        ctx.moveTo(mouseX, 0);
        ctx.lineTo(mouseX, H);
        ctx.strokeStyle = "rgba(100,100,100,0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Dot on curve
        ctx.beginPath();
        ctx.arc(mouseX, hoverY, 4, 0, Math.PI * 2);
        ctx.fillStyle = isBid ? "#15803d" : "#b91c1c";
        ctx.fill();

        // Tooltip box
        const tooltipW = 160;
        const tooltipH = 72;
        const tooltipX = mouseX > W / 2 ? mouseX - tooltipW - 12 : mouseX + 12;
        const tooltipY = 20;

        ctx.fillStyle = "rgba(15,15,15,0.85)";
        ctx.beginPath();
        ctx.roundRect(tooltipX, tooltipY, tooltipW, tooltipH, 6);
        ctx.fill();

        ctx.font = "11px monospace";
        const rangeColor = isBid ? "#16a34a" : "#dc2626";
        ctx.fillStyle = rangeColor;
        ctx.fillText(`Range  ${isBid ? "-" : "+"}${rangePct}%`, tooltipX + 10, tooltipY + 20);
        ctx.fillStyle = "#e5e5e5";
        ctx.fillText(`Price  ${hoverPrice.toFixed(2)}`, tooltipX + 10, tooltipY + 40);
        ctx.fillText(`Amount ${hoverCum.toFixed(4)}`, tooltipX + 10, tooltipY + 60);
      }
    }

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      draw(e.clientX - rect.left);
    };
    const handleMouseLeave = () => draw();

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [rows]);

  return (
    <div ref={wrapperRef}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}

export default DepthChart;