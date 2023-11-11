import { useContext, useState } from "react";
import { FONTEND_URL } from "../env";
import AddUserReviewModal from "../modals/AddUserReviewModal";
import EnterTrackingNumber from "../modals/EnterTrackingNumber";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCheck, faXmark, faLocationDot, faPhone, faTruckFast, faCommentsDollar } from '@fortawesome/free-solid-svg-icons';
import axios from "../config/Axios";
import { authContext } from "../context/AuthContextProvider";
import { loadingContext } from "../context/LoadingContextProvider";
import '../CSS-file/component-css/order-card.css';
import { handleErr } from "../handle-err/HandleErr";

const orderStatus = {
    PREPARE_SHIPPING: 'Prepare Shipping',
    ON_DELIVERY: 'On Delivery',
    RECEIVED: 'Received',
    CANCLE: 'Cancle',
    PENDING_REFUND: 'Pending Refund',
    REFUNDED: 'Refunded'
}

const sellerOrderStatus = {
    PREPARE_SHIPPING: 'Prepare Shipping',
    ON_DELIVERY: 'On Delivery',
    RECEIVED: 'Received',
    CANCLE: 'Cancle',
    PENDING_REFUND: 'Cancle',
    REFUNDED: 'Cancle'
}

const paymentOption = {
    COD: 'Cash on delivery',
    CARD: 'Card',
    QR: 'QR code'
}


export default function OrderCard ({ data, setOrderData, orderData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openTrackingInput, setOpenTrackingInput] = useState(false);
    const { status } = useContext(authContext);
    const { setIsLoading } = useContext(loadingContext);

    async function cancleOrder() {
        setIsLoading(true);
        await axios.patch(`/order/usercancleorder`, {
            orderId: data.id
        })
        .then(() => {
            let updatedOrder = [...orderData].find(el => el.id === data.id);
            updatedOrder.status = updatedOrder.paymentOption === 'COD' ? 'CANCLE' : 'PENDING_REFUND';
            const newArr = [...orderData];
            const index = [...orderData].findIndex(el => el.id === data.id);
            newArr[index] = updatedOrder; 
            setOrderData([...newArr]);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function sellerCancleOrder() {
        setIsLoading(true);
        await axios.patch(`/order/sellercancleorder`, {
            orderId: data.id
        })
        .then(() => {
            let updatedOrder = [...orderData].find(el => el.id === data.id);
            updatedOrder.status = 'CANCLE';
            const newArr = [...orderData];
            const index = [...orderData].findIndex(el => el.id === data.id);
            newArr[index] = updatedOrder; 
            setOrderData([...newArr]);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    return <>
    
    {isOpen && <AddUserReviewModal productId = {data.productId} orderId = {data.id} setIsOpen = {setIsOpen} setOrderData = {setOrderData} orderData = {orderData}/>}
    {openTrackingInput && <EnterTrackingNumber orderId = {data.id} setOpenTrackingInput = {setOpenTrackingInput} setOrderData = {setOrderData} orderData = {orderData} />}
    
    <div className='orderCard'>
        <div className='picBox'>
            <img className='orderPic' src = {data.orderPicture} onClick = {() => window.location.href = `${FONTEND_URL}/product/${data.productId}`} alt = 'product'/>
        </div>
        <div className='orderContentBox'>
            <div className='orderId'>
                order number: {data.id}
            </div>
            <div className='orderProductName'>
                {data.productName}
            </div>
            <div className='orderOption'>
                {data.productOption}
            </div>
            <div className='orderQuantity'>
                quantity: {data.quantity}
            </div>
            <div className='orderTotalPrice'>
                total price: {data.totalPrice > 1000000? (data.totalPrice / 1000000).toFixed(2) + 'M' : data.totalPrice.toLocaleString()} THB       
            </div>
        </div>
        <div className='orderContentBox orderReceiver'>          
            <div className='customerName'>
                {data.receiver}
            </div>
            <div className='orderSentTo'>
                <FontAwesomeIcon icon={faLocationDot} style={{color: "#787878",}} /> {data.destination}
            </div>
            <div className='phoneNumber'>
                <FontAwesomeIcon icon={faPhone} style={{color: "#787878", fontSize: '10px'}} /> {data.phoneNumber}
            </div>
            <div className='orderSentOption'>
                <FontAwesomeIcon icon={faTruckFast} /> {data.shippingOption}
            </div>  
            <div className='orderSentOption'>
                <FontAwesomeIcon icon={faCommentsDollar} /> {paymentOption[data.paymentOption]}
            </div>  
        </div>
        <div className='orderContentBox'>  
            <div className='orderStatus'>
                {data.status === 'PREPARE_SHIPPING' && <FontAwesomeIcon icon={faCircle} style={{color: "#eacf1f", fontSize: '10px'}}/>}
                {data.status === 'ON_DELIVERY' && <FontAwesomeIcon icon={faCircle} style={{color: "#1fddea", fontSize: '10px'}} />}
                {data.status === 'RECEIVED' && <FontAwesomeIcon icon={faCircle} style={{color: "#1fea2d", fontSize: '10px'}} />}
                {data.status === 'CANCLE' && <FontAwesomeIcon icon={faCircle} style={{color: "#EC0D0D", fontSize: '10px'}} />}  
                {data.status === 'PENDING_REFUND' && <FontAwesomeIcon icon={faCircle} style={{color: "#EC0D0D", fontSize: '10px'}} />} 
                {data.status === 'REFUNDED' && <FontAwesomeIcon icon={faCircle} style={{color: "#1fea2d", fontSize: '10px'}} />} 
                
                {' '}{status !== 'seller'? orderStatus[data.status] : sellerOrderStatus[data.status]}
            </div>
            <div className='trackingNumber'>
                {data.trackingNumber}
            </div>


            {data.status === 'ON_DELIVERY' && status === 'user' &&
            <div className='receivedButton' onClick={() => {
                setIsOpen(true)
            }}><FontAwesomeIcon icon={faCheck} /> Received</div>
            }


            {data.status === 'PREPARE_SHIPPING' && status === 'seller' &&
             <div className='sellerEnterTrackingNumberButton' onClick={() => {
                setOpenTrackingInput(true);
            }}> Enter tracking number</div>
            }


            {data.status === 'PREPARE_SHIPPING' && 
            <div className='cancleButton' onClick={() => status === 'user' ? cancleOrder() : sellerCancleOrder()}><FontAwesomeIcon icon={faXmark} /> Cancle </div>
            }
        </div>
    </div>   
    </>
}