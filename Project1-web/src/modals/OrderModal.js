import axios from "../config/Axios";
import { useState } from "react";
import { API_URL, FONTEND_URL } from "../env";
import { authContext } from "../context/AuthContextProvider";
import { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser, faTruckFast, faLocationDot, faPhone, faCreditCard, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons';
import { loadingContext } from "../context/LoadingContextProvider";
import { handleErr } from "../handle-err/HandleErr";
import "../CSS-file/modal-css/order-modal.css";


export default function OrderModal({ productShowPic, productData, optionSelected, sentOptionSelected, amount, totalOrderPrice, sellerData, setOpenModal, priceShow }) {
    const { authUser } = useContext(authContext);
    const [buyNowInputDisable, setBuyNowInputDisable] = useState(true);   
    const [activePaymentButton, setActivePaymentButton] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const [receiveName, setReceiveName] = useState(authUser.receiveName);
    const [destination, setDestination] = useState(authUser.address);
    const [phoneNumber, setPhoneNumber] = useState(authUser.phoneNumber);
    const [paymentOptionSelected, setPaymentOptionSelected] = useState();

    const { setIsLoading } = useContext(loadingContext);
   

    async function createOrders() {
        setIsLoading(true);

        const orderPic =  (productShowPic[0].productId)? `${API_URL}/productpic/${productShowPic[0].picture}` : `${API_URL}/optionpic/${productShowPic[0].picture}` ;                                     
        await axios.post(`/order/createorder`, {
            productName: productData.productName,
            orderPicture: orderPic,
            productOption: optionSelected,
            shippingOption: sentOptionSelected,
            amount: amount,
            totalPrice: totalOrderPrice,
            destination: destination,
            receiver: receiveName,
            phoneNumber: phoneNumber,
            sellerId: sellerData.id,
            productId: productData.id
        })
        .then(() => {
            window.location.href = `${FONTEND_URL}/profile/myorders`;
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };



    return <>
        <div className="modal-bg" onClick = {() => setOpenModal(false)} >
            <div className='buyNowOrderBox' onClick={e => e.stopPropagation()}>
                <div className='buyNowProduct'>
                    <img src={ productShowPic[0].productId? `${API_URL}/productpic/${productShowPic[0].picture}` : `${API_URL}/optionpic/${productShowPic[0].picture}`} alt = 'product'/>
                    <div className='buyNowOrderDetail'>
                        <div className='buyNowProductName'>{productData.productName}</div>
                        <div className='buyNowProductOption'>{optionSelected}</div>
                        <div className='buyNowProductAmount'>amount: {amount}</div>
                        <div className='buyNowSentOption'><FontAwesomeIcon icon={faTruckFast} /> {sentOptionSelected}</div>
                        <div className='buyNowTotalPrice'>
                            Total Price: {priceShow}
                        </div>
                    </div>
                </div>
                <div className='buyNowRecieveInfo'>
                    <div className='buyNowRecieveName'>
                        <div className='buyNowInputHeader'><FontAwesomeIcon icon={faUser} /> Receive Name</div>
                        <input disabled = {buyNowInputDisable} value = {receiveName} onChange = {(e) => setReceiveName(e.target.value)}/>
                    </div>
                    <div className='buyNowDestination'>
                        <div className='buyNowInputHeader'><FontAwesomeIcon icon={faLocationDot} /> Address</div>
                        <textarea disabled = {buyNowInputDisable} value = {destination} onChange = {(e) => setDestination(e.target.value)}/>
                    </div>
                    <div className='buyNowPhone'>
                        <div className='buyNowInputHeader'><FontAwesomeIcon icon={faPhone} /> Phone</div>
                        <input disabled = {buyNowInputDisable} value = {phoneNumber} onChange = {(e) => setPhoneNumber(e.target.value)}/>
                        {!isEdit &&
                        <button className='buyNowEditButton' onClick = {() => {
                            setIsEdit(true);
                            setBuyNowInputDisable(false);
                        }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                        }
                        {isEdit &&
                        <button className='buyNowEditDoneButton' onClick = {() => {
                            setIsEdit(false)
                            setBuyNowInputDisable(true);
                        }}><FontAwesomeIcon icon={faCheck} /></button>
                        }
                    </div>
                    <div className='buyNowPayment'>
                    <div className='buyNowInputHeader'><FontAwesomeIcon icon={faCreditCard} /> Payment Option</div>
                        <div className = 'buyNowPaymentOptionBox'>
                            <div>
                                {!activePaymentButton &&
                                    <div className='buyNowPaymentOption' onClick = {() => {
                                    setActivePaymentButton(true);
                                    setPaymentOptionSelected('Cash on delivery');
                                }}>Cash on delivery</div>
                                }
                                
                                {activePaymentButton &&
                                <div className='buyNowPaymentActiveOption' onClick = {() => {
                                    setActivePaymentButton(false);
                                    setPaymentOptionSelected('');
                                }}>Cash on delivery</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='buyNowButtonBox'>
                    <button className='buyNowCheckOutButton' disabled = {!receiveName || !destination || !phoneNumber || !paymentOptionSelected || isEdit} onClick={() => createOrders()}>Check Out</button>
                    <button className='buyNowCancleButton' onClick={() => {setOpenModal(false)}}>Cancle</button>
                </div>
            </div> 
         </div>  
    </>
}