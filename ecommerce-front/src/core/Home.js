import React , {useState , useEffect} from "react";
import Layout from './Layout';
import {getProducts} from './apiCore';
import Card from './Card'
import Search from './Search'

const Home = () =>{
    
    const [productsBySell , setProductsBySell] = useState([])
    const [productsByArrival , setProductsByArrival] = useState([])
    const [error , setError] = useState(false)

    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if(data.error){
                setError(data.error)
            }else{
                setProductsBySell(data)
            }
        })
    }

    
    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if(data.error){
                setError(data.error)
            }else{
                setProductsByArrival(data)
            }
        })
    }

    useEffect(() => {
           loadProductsByArrival()
           loadProductsBySell()
    }, [])

    return (
        <Layout 
           title = "Welcome to Tingle !" 
           description = "Browse through variety of genres and find books of your choice !  " 
           className='container-fluid'
        >
            <Search/>
           <h2 className='mb-4 mt-5'>New Arrivals</h2>
           <div className="row">
                {productsByArrival.map((product , i) =>(
                        <div key= {i} className= 'col-12 col-lg-3 my-3'>
                           <Card product= {product}/>
                        </div>
                    ))}
           </div>
            
            <h2 className='mb-4 mt-5' >Best Sellers</h2>
            <div className="row">
                {productsBySell.map((product , i) =>(
                     <div key= {i} className= 'col-12 col-lg-3 mb-3'>
                         <Card product= {product}/>
                     </div>
                ))}
            </div>

        </Layout>
    )
}

export default Home;