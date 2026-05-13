import type { PriceLevel } from "../types/orderBookTypes"
import type { orderBookSnapshot } from "../types/orderBookTypes"
type data=[
    number,
    number
]
export function mockData(){
        let bids:PriceLevel[]=[]
        let ask:PriceLevel[]=[]
        let n1=0
        let n2=0
         let data1:data[] =[]
         let data2:data[] =[]
        bids=[] 
        ask=[]
        data1=[]
        data2=[]
        while(n1<21){
            let p=Math.random()*10
            let s=Math.random()*5
            data1.push([97000-p,s])
            n1++
        }
        data1.sort((a, b) => b[0] - a[0])
            data1.map(([i, j]) => {
            bids.push({price:i,size:j})
            });
        n1=0
        while(n2<21){
            let p=Math.random()*10
            let s=Math.random()*5
            data2.push([97000+p,s])
            n2++
        }
        data2.sort((a, b) => a[0] - b[0])
        data2.map(([i, j]) => {
            ask.push({price:i,size:j})
            });
        n2=0
        const orderBook:orderBookSnapshot={bids,ask,timestamps:Date.now()}
        return(orderBook)
}
