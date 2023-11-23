
import "../CSS-file/component-css/order.css"
import { useContext, useEffect, useState } from 'react';
import axios from '../config/Axios';
import OrderCard from './OrderCard';
import { authContext } from '../context/AuthContextProvider';
import { handleErr } from "../handle-err/HandleErr";


const defaultActive = {
    preparing: false,
    inTransit: false,
    received: false,
    cancle: false
}


function Orders() {
    const { status } = useContext(authContext);
    const [allOrder, setAllOrder] = useState();
    const [orderData, setOrderData] = useState();

    const [activeFilterButton, setActiveFilterButton] = useState(defaultActive);

    useEffect(() => {
        document.title = 'My Orders';

        async function getOrderData() {
            await axios.get(`/order/getorderbyuserid`)
            .then(res => {
                const sortedOrder = [...res.data].sort((a, b) => b.id - a.id);
                setAllOrder([...sortedOrder]);
                setOrderData([...sortedOrder]);
            })
            .catch(err => {
                handleErr(err);
            })
        }; 
    
        async function sellerGetOrderData() {
            await axios.get(`/order/getorderbysellerid`)
            .then(res => {
                const sortedOrder = [...res.data].sort((a, b) => b.id - a.id);
                setAllOrder([...sortedOrder]);
                setOrderData([...sortedOrder]);
            })
            .catch(err => {
                handleErr(err);
            })
        }; 



        if(status === 'user') {
            getOrderData();
        }

        if(status === 'seller') {
            sellerGetOrderData();
        }
       // eslint-disable-next-line 
    }, [])

    if(orderData) {
        return(
            <div>
                <div className='orderPageFilterBox'>
                    {!activeFilterButton.preparing &&
                    <button className='orderPageFilterButton' onClick={() => {
                        setActiveFilterButton({...defaultActive, preparing: true});
                        setOrderData(allOrder.filter(e => e.status === 'PREPARING'));
                    }}>Preparing for shipment</button>
                    }
                    {activeFilterButton.preparing &&
                    <button className='orderPageFilterActiveButton'  onClick={() => {
                        setActiveFilterButton({...defaultActive, preparing: false});
                        setOrderData(allOrder);
                    }}>Preparing for shipment</button>
                    }

                    {!activeFilterButton.inTransit &&
                    <button className='orderPageFilterButton'  onClick={() => {
                        setActiveFilterButton({...defaultActive, inTransit: true});
                        setOrderData(allOrder.filter(e => e.status === 'IN_TRANSIT'));
                    }}>In transit</button>
                    }
                    {activeFilterButton.inTransit &&
                    <button className='orderPageFilterActiveButton' onClick={() => {
                        setActiveFilterButton({...defaultActive, inTransit: false});
                        setOrderData(allOrder);
                    }}>In transit</button>
                    }

                    {!activeFilterButton.received &&
                    <button className='orderPageFilterButton' onClick={() => {
                        setActiveFilterButton({...defaultActive, received: true});
                        setOrderData(allOrder.filter(e => e.status === 'RECEIVED'));
                    }}>Received</button>
                    }
                    {activeFilterButton.received &&
                    <button className='orderPageFilterActiveButton' onClick={() => {
                        setActiveFilterButton({...defaultActive, received: false});
                        setOrderData(allOrder);
                    }}>Received</button>
                    }

                    {!activeFilterButton.cancle &&
                    <button className='orderPageFilterButton' onClick={() => {
                        setActiveFilterButton({...defaultActive, cancle: true});
                        setOrderData(allOrder.filter(e => e.status === 'CANCLE' || e.status === 'PENDING_REFUND' || e.status === 'REFUNDED'));
                    }}>Cancle</button>
                    }
                    {activeFilterButton.cancle &&
                    <button className='orderPageFilterActiveButton' onClick={() => {
                        setActiveFilterButton({...defaultActive, cancle: false});
                        setOrderData(allOrder);
                    }}>Cancle</button>
                    }
                </div>
                <div className='orderPage'>
                    {orderData?.map(e => <div key={e.id}><OrderCard data = {e} setOrderData = {setOrderData} orderData = {orderData} /></div>)}
                </div>
            </div>
    
        );
    }
}

export default Orders