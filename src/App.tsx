
import './App.css'
import { useOrderBook } from './hooks/useOrderBook';
import OrderBookTable from './components/OrderBookTable.tsx';
import DeepCharts from './components/DepthChart.tsx';
import SpreadMatrice from './components/SpreadMatrice.tsx';
import Sparkline from './components/ imbalance.tsx';
function App() {
 const data = useOrderBook();
    console.log(data);
  return (
    <>
    <div className='px-4'>
      <div className='flex'>
         <OrderBookTable />
         <div className='py-20 px-10'>
          {data.spreadMetrics &&  <SpreadMatrice rows={data.spreadMetrics}/>}
          <DeepCharts rows={data.rowData}/>
          <br />
          <Sparkline />
         </div>
         
      </div>

    </div>
    
    </>
  )
}

export default App
