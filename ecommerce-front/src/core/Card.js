import React, {useState} from 'react'
import {Link , Redirect} from 'react-router-dom'
import ShowImage from './ShowImage'
import moment from 'moment'
import {addItem , updateItem , removeItem} from './cartHelpers'

const Card = ({
        product, 
        showViewProductButton= true, 
        showAddToCartButton= true , 
        cartUpdate= false,
        showRemoveProductButton= false,
        setRun = f => f, // default value of function
        run = undefined // default value of undefined
    })=> {

    const [redirect, setRedirect] = useState(false)
    const [count, setCount] = useState(product.count)
    
    const showViewButton = (showViewProductButton) => {
        return (
            showViewProductButton && (
            <Link to= {`/product/${product._id}`}>
                <button className= 'btn btn-outline-primary my-2 mr-2'>
                    View Product
                </button>
            </Link>     
            )
        )
    }


    const addToCart = () => {
        addItem(product, () => {
               setRedirect(true)
        })
    }

    const shouldRedirect = redirect => {
         if(redirect) {
             return <Redirect to= '/cart' />
         }
    }


    const showAddToCart = (showAddToCartButton) => {
        return (
        showAddToCartButton && (
            <button 
                onClick= {addToCart} 
                className= 'btn btn-outline-warning my-2'
            >
               Add to Cart
            </button>
        )
     )  
    }

    
    const showRemoveButton = (showRemoveProductButton) => {
        return (
        showRemoveProductButton && (
            <button 
              onClick={() => {
                removeItem(product._id);
                setRun(!run); // run useEffect in parent Cart
              }}
                className= 'btn btn-outline-danger m-2'
            >
               Remove Product
            </button>
        )
     )  
    }


    const showStock = (quantity) => {
        return quantity > 0 ? (
            <span className= 'badge px-2 py-1 my-1  badge-success badge-pill'>In Stock</span> 
        ) : (
            <span className= 'badge px-2 py-1 my-1 ml-2 badge-danger badge-pill'>Out of Stock</span> 

        )    
    }


    const handleChange = (productId) => event => {
        setRun(!run); // run useEffect in parent Cart
         setCount(event.target.value < 1 ? 1 : event.target.value)
         if(event.target.value >= 1){
             updateItem(productId, event.target.value)
         }
    }

    const showCartUpdateOptions = cartUpdate => {
        return cartUpdate && <div> 
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">Quantity</span>
                </div>
                <input 
                   type="number" 
                   className= 'form-control' 
                   value= {count} 
                   onChange= {handleChange(product._id)} 
                />
            </div>
        </div>
    }
    
    
    return(
        //.substring(0,100)
        
            <div className="card my-3">
                <div className="card-header name py-2" style= {{fontSize: '21px'}}> <b>{product.name}</b></div>
                <div className="card-body">
                  {shouldRedirect(redirect)}
                  <ShowImage item= {product} url= 'product'/>  
                    {/* <p className= ' mt-2'><b>{product.description}</b></p> */}
                    <p className= "black-10 px-2">Rs.{product.price}</p>
                    <p className= 'black-9 px-2'>Genre : {product.category && product.category.name}</p>
                    <p className= 'black-8 px-2'>
                        Added {moment(product.createdAt).fromNow()}
                    </p>
                    
                        {showStock(product.quantity)}
                         <br />
                        {showViewButton(showViewProductButton)}
                    
                        {showAddToCart(showAddToCartButton)}

                        {showRemoveButton(showRemoveProductButton)}

                        {showCartUpdateOptions(cartUpdate)}
                  
                </div>
            </div>
        
    )
}

export default Card;