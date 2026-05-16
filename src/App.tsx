
import './App.css'
import { useOrderBook } from './hooks/useOrderBook';
import OrderBookTable from './components/OrderBookTable.tsx';
function App() {
 const data = useOrderBook();
    console.log(data);
  return (
    <>
    <div className='px-4'>
      <OrderBookTable />
    </div>
    
    </>
  )
}

export default App
