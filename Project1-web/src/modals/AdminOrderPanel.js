import axios from "../config/Axios"
import { useContext, useEffect, useState } from "react";
import '../CSS-file/modal-css/admin-order-modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStore, faMoneyCheck, faPhone, faEnvelope, faBank } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram} from '@fortawesome/free-brands-svg-icons';
import { FONTEND_URL } from "../env";
import { handleErr } from "../handle-err/HandleErr";
import { loadingContext } from "../context/LoadingContextProvider";





function AdminOrderPanel(props) {
    // eslint-disable-next-line
    const [orderData, setOrderData] = useState(props.orderData);
    const [userData, setUserData] =  useState();
    const [sellerData, setSellerData] =  useState();
    const [paymentRef, setPaymentRef] = useState();
    const { setIsLoading } = useContext(loadingContext);


    async function refundOrder() {
        setIsLoading(true);

        await axios.patch(`/order/refundorder`, {orderId: orderData.id, ref: paymentRef})
        .then(() => {
            window.location.reload();
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function updateOrder() {
        setIsLoading(true);

        await axios.patch(`/order/adminupdateorder`, {orderId: orderData.id})
        .then(() => {
            window.location.reload();
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    function goToStorePage() {
        if(Object.keys(sellerData).length !== 0) {
            window.open(`${FONTEND_URL}/shop/${sellerData.storeName}`, '_Blank')
        }; 
    };

    function getOrderDate() {
        if(`${orderData?.date}`.length > 1) {
            if(`${orderData?.month}`.length > 1) {
                return `${orderData.date}/${orderData.month}/${orderData.year}`;
            } else {
                return `${orderData.date}/0${orderData.month}/${orderData.year}`;
            };
        } else {
            if(`${orderData?.month}`.length > 1) {
                return `0${orderData.date}/${orderData.month}/${orderData.year}`;
            } else {
                return `0${orderData.date}/0${orderData.month}/${orderData.year}`;
            };
        };
    }

    useEffect(() => {
        if(orderData) {
            setUserData({...orderData.user});
            setSellerData({...orderData.seller});
        }
    }, [orderData]);

   
    return <>
        <div className="modal-bg" onClick={() => props.setOrderPanel()}>
            <div className="orderPanel" onClick={e => e.stopPropagation()}>
                <div className="adminOrderStatus">Status: {orderData?.status}</div>
                <div className="orderInfo">
                    <img src={orderData?.orderPicture} alt = 'orderPic'/>
                    <div className="textBox">
                        <div className="textHeader">Order</div>
                        <div className="adminOrderText">Id: {orderData?.id}</div>
                        <div className="adminOrderText">Product: {orderData?.productName}</div>
                        <div className="adminOrderText">Option: {orderData?.productOption}</div>
                        <div className="adminOrderText">Shipping Option: {orderData?.shippingOption}</div>
                        <div className="adminOrderText">Quantity: {orderData?.quantity}</div>
                        <div className="adminOrderText">Total Price: {orderData?.totalPrice.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})}</div>
                        <div className="adminOrderText">Payment Option: {orderData?.paymentOption}</div>
                        {orderData?.ref && <>
                        <div className="adminOrderText">Refund Ref.: {orderData?.ref}</div>
                        <div className="adminOrderText">Admin: {orderData?.admin? orderData.admin.username : `[Delete Accoumt]`}</div>
                        </>
                        }
                        <div className="adminOrderText">Last Update: {getOrderDate()}</div>
                    </div>
                    <div className="textBox link" onClick={() => goToStorePage()}>
                        <div className="textHeader">Seller</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faUser}/></div> {sellerData? Object.keys(sellerData).length === 0 ? '[Deleted Account]' : sellerData.id : ''}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faStore}/></div>  {sellerData?.storeName}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faFacebookF}/></div> {sellerData?.facebook}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faInstagram}/></div> {sellerData?.instagram}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faEnvelope}/></div> {sellerData?.email}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faPhone}/></div> {sellerData?.phoneNumber}</div>
                    </div>
                    <div className="textBox">
                        <div className="textHeader user">User</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faUser}/></div> {userData? Object.keys(userData).length === 0 ? '[Deleted Account]' : userData.id : '' }</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faEnvelope}/></div> {userData?.email}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faPhone}/></div> {userData?.phoneNumber}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faBank}/></div> {userData?.bankName}</div>
                        <div className="adminOrderText"><div className="icon"><FontAwesomeIcon icon={faMoneyCheck} /></div> {userData?.bankAccountNumber}</div>
                    </div>
                </div>
                { orderData?.status === 'PENDING_REFUND' &&
                <div className="adminSubmitRefundBox">
                    <input className="paymentRefInput" placeholder="Payment's Ref" value={paymentRef} onChange = {e => setPaymentRef(e.target.value)}/>
                    <div className="adminOrderButton" style={{pointerEvents: paymentRef? '' : 'none'}} onClick = {() => refundOrder()} > Submit </div>
                </div>
                }
                { orderData?.status === 'ON_DELIVERY' &&
                <div className="adminSubmitRefundBox">
                    <div className="adminOrderButton" onClick = {() => updateOrder()} > Force Receive ! </div>
                </div>
                }
            </div>
        </div>
     </>
        
    
};

export default AdminOrderPanel