import React from "react";
import Menu from './Menu';
import '../styles.css'

const Layout = ({ title = 'Title', 
                 description = 'Description', 
                 className,
                 children 
                }) => (
                  <div>
                    <Menu/>  
                    <div className= "jumbotron mt-4">
                        <h2 className= 'mt-5 mt-md-2 title'>{title}</h2>
                        <p className='lead description'>{description}</p>
                    </div>
                    <div className = {className}>
                        {children}
                    </div>
                  </div>  
                )

export default Layout;