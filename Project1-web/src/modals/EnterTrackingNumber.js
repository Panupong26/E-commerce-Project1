import axios from '../config/Axios';
import { useContext, useEffect, useState } from 'react';
import '../CSS-file/modal-css/add-tracking.css';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';

function EnterTrackingNumber({ orderId, setOpenTrackingInput, orderData, setOrderData }) {
    const [trackingNumber, setTrackingNumber] = useState();
    const [enterTrackingNumberButtonDisable, setEnterTrackingNumberButtonDisable] = useState(true);
    const { setIsLoading } = useContext(loadingContext);

    async function addTrackingNumber() {
        setIsLoading(true);

        await axios.put(`/order/sellerupdateorder`, {
            orderId: orderId,
            trackingNumber: trackingNumber
        })
        .then(() => {
            const updatedOrder = [...orderData].find(el => el.id === orderId);
            updatedOrder.trackingNumber = trackingNumber;
            updatedOrder.status = 'ON_DELIVERY';
            const newArr = [...orderData];
            const index = [...orderData].findIndex(el => el.id === orderId);
            newArr[index] = updatedOrder; 
            setOrderData([...newArr]);
            setOpenTrackingInput(false);
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        if(trackingNumber) {
            setEnterTrackingNumberButtonDisable(false);
        } else {
            setEnterTrackingNumberButtonDisable(true);
        }
    }, [trackingNumber])

    return (
        <div className='modal-bg' onClick={() => setOpenTrackingInput(false)}>
            <div className='enterTrackingNumberBox' onClick={e => e.stopPropagation()}>
                <div className='enterTrackingNumberOrderId'>order ID: {orderId}</div>
                <input placeholder='Enter tracking number' value={trackingNumber} onChange = {(e) => setTrackingNumber(e.target.value)}/>
                <div className='enterTrackingNumberButtonBox'>
                    <button className='enterTrackingNumberButton' disabled = {enterTrackingNumberButtonDisable} onClick = {() => addTrackingNumber()}>Enter</button>
                    <button className='enterTrackingNumberButton' onClick = {() => setOpenTrackingInput(false)}>Cancle</button>
                </div>
            </div>
        </div>
    ) 
} 

export default EnterTrackingNumber