import axios from "../config/Axios";
import { useState } from "react";
import { API_URL, FONTEND_URL } from "../env";
import { authContext } from "../context/AuthContextProvider";
import { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faUser, faTruckFast, faLocationDot, faPhone, faCreditCard, faPenToSquare, faCheck, faQrcode, faTruckRampBox } from '@fortawesome/free-solid-svg-icons';
import { loadingContext } from "../context/LoadingContextProvider";
import { handleErr } from "../handle-err/HandleErr";
import "../CSS-file/modal-css/order-modal.css";

const defaultActivePaymentButton = {
    cod: false,
    card: false,
    qr: false
}


export default function OrderModal({ productShowPic, productData, optionSelected, sentOptionSelected, quantity, totalOrderPrice, sellerData, setOpenModal, priceShow }) {
    const { authUser } = useContext(authContext);
    const [buyNowInputDisable, setBuyNowInputDisable] = useState(true);   
    const [activePaymentButton, setActivePaymentButton] = useState(defaultActivePaymentButton);
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
            quantity: quantity,
            totalPrice: totalOrderPrice,
            paymentOption: paymentOptionSelected,
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

    async function createPayment() {
        setIsLoading(true);

        const orderPic =  (productShowPic[0].productId)? `${API_URL}/productpic/${productShowPic[0].picture}` : `${API_URL}/optionpic/${productShowPic[0].picture}` ;                                     
        await axios.post(`/payment/create-checkout-session`, {
            item: JSON.stringify([{
                productName: productData.productName,
                orderPicture: orderPic,
                productOption: optionSelected,
                shippingOption: sentOptionSelected,
                quantity: quantity,
                totalPrice: totalOrderPrice,
                productId: productData.id
            }]),
            paymentOption: paymentOptionSelected,
            destination: destination,
            receiver: receiveName,
            phoneNumber: phoneNumber,    
        })
        .then(res => {
            window.location.href = res.data.url;
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    function handleClick() {
        if(paymentOptionSelected === 'COD') {
            createOrders();
        } else {
            createPayment();
        }
    }




    return <>
        <div className="modal-bg" onClick = {() => setOpenModal(false)} >
            <div className='buyNowOrderBox' onClick={e => e.stopPropagation()}>
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
                <div className='buyNowProduct'>
                    <img src={ productShowPic[0].productId? `${API_URL}/productpic/${productShowPic[0].picture}` : `${API_URL}/optionpic/${productShowPic[0].picture}`} alt = 'product'/>
                    <div className='buyNowOrderDetail'>
                        <div className='buyNowProductName'>{productData.productName}</div>
                        <div className='buyNowProductOption'>{optionSelected}</div>
                        <div className='buyNowProductQuantity'>quantity: {quantity}</div>
                        <div className='buyNowSentOption'><FontAwesomeIcon icon={faTruckFast} /> {sentOptionSelected}</div>
                        <div className='buyNowTotalPrice'>
                            Total Price: {priceShow}
                        </div>
                    </div>
                </div>
                <div className='buyNowRecieveInfo'>

                    <div className='buyNowRecieveName'>
                        <div className='buyNowInputHeader'><FontAwesomeIcon icon={faUser} /> Receive Name</div>
                        <input disabled = {buyNowInputDisable} value = {receiveName || ''} onChange = {(e) => setReceiveName(e.target.value)}/>
                    </div>

                    <div className='buyNowDestination'>
                        <div className='buyNowInputHeader'><FontAwesomeIcon icon={faLocationDot} /> Address</div>
                        <textarea disabled = {buyNowInputDisable} value = {destination || ''} onChange = {(e) => setDestination(e.target.value)}/>
                    </div>

                    <div className='buyNowPhone'>
                        <div className='buyNowInputHeader'><FontAwesomeIcon icon={faPhone} /> Phone</div>
                        <input disabled = {buyNowInputDisable} value = {phoneNumber || ''} onChange = {(e) => setPhoneNumber(e.target.value)}/>
                    </div>

                    <div className='buyNowPayment'>
                        <div className='buyNowInputHeader'> Payment Option</div>
                            <div className = 'buyNowPaymentOptionBox'>
                                
                                {productData.acceptCod === 'TRUE' &&
                                <div>
                                    {!activePaymentButton.cod &&
                                        <div className='buyNowPaymentOption' onClick = {() => {
                                        setPaymentOptionSelected('COD');
                                        setActivePaymentButton({...defaultActivePaymentButton, cod: true});
                                    }}><FontAwesomeIcon icon={faTruckRampBox} /> Cash on delivery</div>
                                    }
                                    
                                    {activePaymentButton.cod && 
                                    <div className='buyNowPaymentActiveOption' onClick = {() => {
                                        setPaymentOptionSelected();
                                        setActivePaymentButton({...defaultActivePaymentButton});
                                    }}><FontAwesomeIcon icon={faTruckRampBox} /> Cash on delivery</div>
                                    }
                                </div>
                                }

                                <div>
                                    {!activePaymentButton.card &&
                                        <div className='buyNowPaymentOption' onClick = {() => {
                                        setPaymentOptionSelected('CARD');
                                        setActivePaymentButton({...defaultActivePaymentButton, card: true});
                                    }}><FontAwesomeIcon icon={faCreditCard} /> Card</div>
                                    }
                                    
                                    {activePaymentButton.card && 
                                    <div className='buyNowPaymentActiveOption' onClick = {() => {
                                        setPaymentOptionSelected();
                                        setActivePaymentButton({...defaultActivePaymentButton});
                                    }}><FontAwesomeIcon icon={faCreditCard} /> Card</div>
                                    }
                                </div>
                               
                                <div>
                                    {!activePaymentButton.qr &&
                                        <div className='buyNowPaymentOption' onClick = {() => {
                                        setPaymentOptionSelected('QR');
                                        setActivePaymentButton({...defaultActivePaymentButton, qr: true});
                                    }}><FontAwesomeIcon icon={faQrcode} /> OR code</div>
                                    }
                                    
                                    {activePaymentButton.qr && 
                                    <div className='buyNowPaymentActiveOption' onClick = {() => {
                                        setPaymentOptionSelected();
                                        setActivePaymentButton({...defaultActivePaymentButton});
                                    }}><FontAwesomeIcon icon={faQrcode} /> OR code</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                <div className='buyNowButtonBox'>
                    <button className='buyNowCheckOutButton' disabled = {!receiveName || !destination || !phoneNumber || !paymentOptionSelected || isEdit} onClick={() => handleClick()}>Check Out</button>
                    <button className='buyNowCancleButton' onClick={() => {setOpenModal(false)}}>Cancle</button>
                </div>
            </div> 
         </div>  
    </>
}