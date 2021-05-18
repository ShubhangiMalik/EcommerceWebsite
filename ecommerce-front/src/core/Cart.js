import React , {useState , useEffect} from "react";
import {Link} from 'react-router-dom';
import Layout from './Layout';
import {getCart} from './cartHelpers';
import Card from './Card';
import Checkout from './Checkout'


const Cart = () => {
    const[items, setItems] = useState([])
    const [run, setRun] = useState(false);


    useEffect(() => {
        setItems(getCart())
    }, [run])

    
   const showItems = items => {
       return (
           <div>
               <h3 className= 'mb-4'>Your cart has {`${items.length}`} items</h3>
               <hr />
               {items.map((product , i) => (
                   <Card 
                      key= {i} 
                      product= {product} 
                      showAddToCartButton = {false}
                      cartUpdate = {true}
                      showRemoveProductButton = {true}
                      setRun= {setRun}
                      run= {run}
                   />
               ))}
           </div>
       )
   }

   const noItemsMessage = () => (
    <div> 
       <h3 className= 'mb-4'>Your cart is empty </h3> <hr />
       <h4 className= 'mt-4 pt-3'>
       <Link to= '/shop'>Click here </Link>to continue shopping !
       </h4>
    </div> 
   )


    return (
        <Layout 
           title = "Shopping Cart" 
           description = "Manage your cart items. Add, remove, checkout or continue shopping !" 
           className='container-fluid'
        >
            
          <div className="row justify-content-around">
              <div className="col-12 col-lg-5">
                  {items.length > 0 ? showItems(items) : noItemsMessage()}
              </div>
              <div className="col-lg-6 col-12">
                  <h3 className= "mb-4"> Your cart summary</h3>
                  <hr /><br />
                  <Checkout products= {items} setRun= {setRun} run= {run}/>
              </div>
          </div>

        </Layout>
    )
}

export default Cart;
