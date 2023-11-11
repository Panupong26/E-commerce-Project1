
import '../../CSS-file/component-css/user-cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLocationDot, faPhone, faPenToSquare, faCreditCard, faUser } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import axios from '../../config/Axios';
import CartCard from '../../component/CartCard';
import { loadingContext } from '../../context/LoadingContextProvider';
import { handleErr } from '../../handle-err/HandleErr';

const defaultPaymentOptionButton = {
    card: false,
    qr: false
}



export default function Cart({ userData, cartData, setCartData }) {
    const [cartSelected, setCartSelected] = useState([]);
    const [address,setAddress] = useState(userData?.address || '');
    const [phoneNumber,setPhoneNumber] = useState(userData?.phoneNumber || '');
    const [receiveName, setReceiveName] = useState(userData?.receiveName || '');
    const [paymentOption, setPaymentOption] = useState();


    
    //event
    const [isEdit, setIsEdit] = useState(false);
    const [activePaymentOption, setActivePaymentOption] = useState(defaultPaymentOptionButton);
    const { setIsLoading } = useContext(loadingContext);



    async function deleteCart(cartId) {
        setIsLoading(true);
        await axios.delete(`/cart/deletecart/${cartId}`)
        .then(() => {
            const newCartSelected = [...cartSelected].filter(el => el.id !== cartId);
            setCartSelected([...newCartSelected]);
            const newCartData = [...cartData].filter(el => el.id !== cartId);
            setCartData([...newCartData]);
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    async function createOrderFromCart() {
        setIsLoading(true);
        await axios.post(`/order/createmultiorders`, {
            cartArr: cartSelected,
            destination: address,
            phoneNumber: phoneNumber,
            receiver: receiveName,
            paymentOption: paymentOption
        })
        .then(() => {
            const newCartData = [...cartData];
            cartSelected.forEach(e => newCartData.splice(newCartData.findIndex(i => i.id === e.id), 1));
            setCartData([...newCartData]);
            setCartSelected([]);
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }


    function calTotalPrice() {
        let result = 0;
        if(cartSelected && cartSelected[0]) {
            cartSelected.forEach(t => {
            result += t.totalPrice;
        }) 
        return result.toLocaleString()}
    }

    useEffect(() => {
        document.title = 'My Carts';
    }, [])



    return <>
        <div className='cartPage'>
            <div className='cartBox'>
                {cartData?.sort((a, b) => b.id-a.id).map(e => 
                    <div key={e.id}>
                        <CartCard 
                            data = {e} 
                            setCartSelected = {setCartSelected}
                            cartSelected = {cartSelected}
                            deleteCart = {deleteCart}
                        />  
                    </div>    
                )}
            </div>
            <div className='orderArea'>
                
                {cartSelected[0] && 
                <div className='cartTotalPrice'>
                  Total Price: {calTotalPrice()} THB         
                </div>
                }
                
                <div className='orderOptionBox'>
                    <div className='locationInputBox'>
                        <div>
                            <div className='locationInputHeader'><FontAwesomeIcon icon={faUser} /> Receive Name </div>
                            <input className='cartReceiveNameInput' disabled={!isEdit} value={receiveName} onChange={(e) => setReceiveName(e.target.value)} />
                        </div>
                        <div>
                            <div className='locationInputHeader'><FontAwesomeIcon icon={faLocationDot} style={{color: "#787878",}} /> Address </div>
                            <textarea className='locationInput' disabled={!isEdit} value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div>
                            <div className='locationInputHeader'><FontAwesomeIcon icon={faPhone} style={{color: "#787878",}} /> Phone Number </div>
                            <input className='cartPhoneNumberInput' disabled={!isEdit} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div>
                            {!isEdit &&
                            <div className='editLocationButton'  
                                onClick={() => {
                                    setIsEdit(true); 
                                }}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                            </div>
                            }
                            {isEdit &&
                            <div className='editLocationButton'  
                                onClick={() => {
                                    setIsEdit(false); 
                                }} >
                                    <FontAwesomeIcon icon={faCheck} />
                            </div>
                            }
                        </div>
                    </div>  
                    <div className='paymentOptionBox'>
                        <div className='paymentOptionHeader'><FontAwesomeIcon icon={faCreditCard} /> Payment Option </div>
                        <div className='paymentOptionButtonBox'>
                           
                            <div>
                                {!activePaymentOption.card &&
                                <div className='paymentOption' 
                                    onClick={() => {
                                        setPaymentOption('CARD'); 
                                        setActivePaymentOption({...defaultPaymentOptionButton, card: true}); 
                                }}>Card</div>
                                } 

                                {activePaymentOption.card &&
                                <div className='paymentActiveOption'    
                                    onClick={() => {
                                        setPaymentOption();
                                        setActivePaymentOption({...defaultPaymentOptionButton}); 
                                }}>Card</div>
                                }
                            </div> 

                            <div>
                                {!activePaymentOption.qr &&
                                <div className='paymentOption' 
                                    onClick={() => {
                                        setPaymentOption('QR'); 
                                        setActivePaymentOption({...defaultPaymentOptionButton, qr: true}); 
                                }}>QR code</div>
                                } 

                                {activePaymentOption.qr &&
                                <div className='paymentActiveOption'    
                                    onClick={() => {
                                        setPaymentOption();
                                        setActivePaymentOption({...defaultPaymentOptionButton}); 
                                }}>QR code</div>
                                }
                            </div> 
                        </div> 
                    </div>
                    <button className='checkOutButton' disabled={!receiveName || !phoneNumber || !address || !paymentOption || !(cartSelected && cartSelected[0])} onClick = {() => createOrderFromCart()}>Check Out</button>
                </div>
            </div>
        </div>
    </>
}

