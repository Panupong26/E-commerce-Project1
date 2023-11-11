import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { FONTEND_URL } from '../env';
import { useState } from 'react';
import "../CSS-file/component-css/cart-card.css";


export default function CartCard({ data, setCartSelected, cartSelected, deleteCart }) {
    const [isActive, setIsActive] = useState(false);
    
    return <>
        { !isActive &&
        <div className='cartCard' onClick = {()=> {
            setIsActive(true);
            setCartSelected([...cartSelected, data]);
        }}>
            <img className='cartPic' src = {data.cartPicture} onClick = {() => window.location.href = `${FONTEND_URL}/product/${data.productId}`} alt='product'/>
            <div className='cartContentBox'>
                <div className='cartProductName'>
                    {data.productName}
                </div>
                <div className='cartOption'>
                    {data.productOption}
                </div>
                <div className='cartQuantity'>
                    quantity: {data.quantity}
                </div>
                <div className='cartSentOption'>
                    <FontAwesomeIcon icon={faTruckFast} /> {data.shippingOption}
                </div>
            </div>
            <div className='cartPrice'>
                Total Price: {data.totalPrice > 1000000? (data.totalPrice / 1000000).toFixed(2) + 'M' : data.totalPrice.toLocaleString()} THB
            </div>
            <div className='removeButton' onClick={() => deleteCart(data.id)}>
                    <FontAwesomeIcon icon={faXmark} /> 
            </div>
        </div> 
        }

        {isActive &&
        <div className='cartActiveCard' onClick = {()=> {
            setIsActive(false);
            const newSelected = cartSelected.filter(e => e.id !== data.id);
            setCartSelected([...newSelected]);
        }}>
            <img className='cartPic' src = {data.cartPicture} onClick = {() => window.location.href = `${FONTEND_URL}/product/${data.productId}`} alt='product'/>
            <div className='cartContentBox'>
                <div className='cartProductName'>
                    {data.productName}
                </div>
                <div className='cartOption'>
                    {data.productOption}
                </div>
                <div className='cartQuantity'>
                    quantity: {data.quantity}
                </div>
                <div className='cartSentOption'>
                    <FontAwesomeIcon icon={faTruckFast} /> {data.shippingOption}
                </div>
            </div>
            <div className='cartPrice'>
                Total Price: {data.totalPrice > 1000000? (data.totalPrice / 1000000).toFixed(2) + 'M' : data.totalPrice.toLocaleString()} THB       
            </div>
            <div className='removeButton' onClick={() => deleteCart(data.id)}>
                    <FontAwesomeIcon icon={faXmark} /> 
            </div>
        </div>
        }
    </> 
}
