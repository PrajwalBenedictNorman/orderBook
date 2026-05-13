
import './App.css'
import { useOrderBook } from './hooks/useOrderBook';
function App() {
 const data = useOrderBook();
    console.log(data);
  return (
    <>
     <h1 className='text-green-300'>This is it</h1>
    </>
  )
}

export default App
