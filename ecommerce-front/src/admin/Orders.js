import React , { useState , useEffect} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import {Link} from 'react-router-dom'
import {listOrders , getStatusValues , updateOrderStatus} from './apiAdmin'
import moment from 'moment'
import { updateLocale } from 'moment'


const Orders = () => {
   const [orders, setOrders] = useState([])
   const [statusValues, setStatusValues] = useState([])

   const { user , token } = isAuthenticated()

   const loadOrders = () => {
        listOrders(user._id, token).then(data => {
            if(data.error){
                console.log(data.error)
            }else{
                setOrders(data)
            }
        })
   }

   const loadStatusValues = () => {
    getStatusValues(user._id, token).then(data => {
        if(data.error){
            console.log(data.error)
        }else{
            setStatusValues(data)
        }
    })
}

   useEffect(() => {
       loadOrders()
       loadStatusValues()
   }, [])

   const showOrdersLength = () => {
       if(orders.length > 0){
           return (
               <h1 > Total orders: {orders.length}</h1>
           )
       }else {
           return <h1 className="text-danger">No orders</h1>
       }
   }

   const showInput = (key , value ) => (
       <div className= 'input-group mb-2 mr-sm-2'>
           <div className= 'input-group-prepend'>
               <div className="input-group-text">{key}</div>
           </div>
           <input type="text" value= {value} className= 'form-control' readOnly />
       </div>
   )

   const handleStatusChange = (e , orderId) => {
       updateOrderStatus(user._id, token, orderId, e.target.value)
       .then(data => {
           if(data.error){
               console.log('status update failed')
           }else{
               loadOrders()
           }
       })
   }


   const showStatus = (o) => (
       <div className="form-group">
           <h5 className="mb-4 mark">{o.status}</h5>
           <select className= 'form-control' onChange= {(e) => handleStatusChange(e , o._id)}>
               <option>Update status</option>
               {statusValues.map((status, index) => (
                   <option key= {index} value= {status}>
                       {status}
                  </option>
               ))}
           </select>
       </div>
   )

   return (
            <Layout 
                title='Orders' 
                description = { ` Welcome ${user.name}, you can manage all the orders here ` } 
                
            >
            
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        {showOrdersLength()}
                        
                        {orders.map((o , oIndex) => {
                               return (
                                   <div 
                                     className="mt-3 mb-2" 
                                     key= {oIndex}
                                     style= {{borderBottom: "5px solid indigo"}}
                                   >
                                     <h4 className="mt-5 mb-4 pt-5">
                                         <span className="bg-info p-3">
                                             Order ID: {o._id}
                                         </span>
                                     </h4>

                                     <ul className="list-group mb-2">
                                         <li className="list-group-item">
                                             Status: {showStatus(o)}
                                         </li>
                                         <li className="list-group-item">
                                             Transaction ID: {o.transaction_id}
                                         </li>
                                         <li className="list-group-item">
                                             Amount: Rs.{o.amount}
                                         </li><li className="list-group-item">
                                             Ordered By:{o.user.name}
                                         </li>
                                         <li className="list-group-item">
                                             Ordered on: {moment(o.createdAt).fromNow()}
                                         </li>
                                         <li className="list-group-item">
                                             Delivery Address: {o.address}
                                         </li>
                                     </ul>

                                     <h5 className= 'mt-4 mb-4 font-italic'>
                                         Total products in the order: {o.products.length}
                                     </h5>

                                     {o.products.map((p , pIndex) => (
                                         <div 
                                           className="mb-4"
                                           key= {pIndex}
                                           style= {{padding: '20px' , border: '1px solid indigo'}}
                                         >
                                            {showInput('Product name' , p.name)}
                                            {showInput('Product price' , p.price)}
                                            {showInput('Product quantity' , p.count)}
                                            {showInput('Product Id' , p._id)}
                                         </div>
                                     ))}
                                   </div>
                               )
                        })}
                    </div>
                </div>
        </Layout>
   )
}
 
export default Orders;