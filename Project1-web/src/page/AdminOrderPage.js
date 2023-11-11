import '../CSS-file/page-css/admin-order.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import axios from "../config/Axios"
import { useEffect, useState } from 'react';
import AdminOrderPanel from '../modals/AdminOrderPanel';
import { handleErr } from '../handle-err/HandleErr';



function AdminOrderPage(props) {
    const [orderData, setOrderData] = useState([]);
    const [allOrder, setAllOrder] = useState();
    const [filteredOrder, setFilteredOrder] = useState();
    const [orderIdInput, setOrderIdInput] = useState();
    const [idfilteredOrder, setIdFilteredOrder] = useState();
    const [sort, setSort] = useState();
    const [minDate, setMinDate] = useState();
    const [maxDate, setMaxDate] = useState();
    const [totalValue, setTotalValue] = useState();
    const [totalPrice, setTotalPrice] = useState();

    const [prepareShippingButtonDis,setPrepareShippingButtonDis] = useState();
    const [prepareShippingActiveButtonDis,setPrepareShippingActiveButtonDis] = useState('none');
    const [onDeliveryButtonDis,setOnDeliveryButtonDis] = useState();
    const [onDeliveryActiveButtonDis,setOnDeliveryActiveButtonDis] = useState('none');
    const [receivedButtonDis,setReceivedButtonDis] = useState();
    const [receivedActiveButtonDis,setReceivedActiveButtonDis] = useState('none');
    const [cancleButtonDis,setCancleButtonDis] = useState();
    const [cancleActiveButtonDis,setCancleActiveButtonDis] = useState('none');

    const [orderPanel, setOrderPanel] = useState();
    const [sortMenuDis, setSortMenuDis] = useState('none');
    

    async function getOrder() {
        await axios.get(`/order/getallorder`)
        .then(res => {
            setOrderData([...res.data]);
            setAllOrder([...res.data]);
            setFilteredOrder([...res.data]);
        })
        .catch(err => {
           handleErr(err);
        })
    };


    function resetButton() {
        setPrepareShippingButtonDis();
        setPrepareShippingActiveButtonDis('none');
        setOnDeliveryButtonDis();
        setOnDeliveryActiveButtonDis('none');
        setReceivedButtonDis();
        setReceivedActiveButtonDis('none');
        setCancleButtonDis();
        setCancleActiveButtonDis('none');
    };


    useEffect(() => {
        document.title = 'Orders';
        getOrder();
    }, [])

    useEffect(() => {
        if(filteredOrder) {
            if(orderIdInput) {
                setIdFilteredOrder(filteredOrder.filter(e => e.id === +orderIdInput));       
            } else {
                setIdFilteredOrder([...filteredOrder]);
            };
        };
    }, [orderIdInput, filteredOrder])

    useEffect(() => {
        if(idfilteredOrder) {
            if(minDate) {
                if(maxDate) {
                    let min = +(minDate.replaceAll('-',''));
                    let max = +(maxDate.replaceAll('-',''));
                    let order = idfilteredOrder.filter(e => {
                        if(`${e.date}`.length > 1) {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}${e.date}`) >= min && +(`${e.year}${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}${e.date}`) >= min && +(`${e.year}0${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        } else {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}0${e.date}`) >= min && +(`${e.year}${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}0${e.date}`) >= min && +(`${e.year}0${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        };
                    });
                    setOrderData([...order]);
                } else {
                    let min = +(minDate.replaceAll('-',''));
                    let date = new Date();
                    let day = `${date.getDate()}`.length > 1 ? `${date.getDate()}` : `0${date.getDate()}` ;
                    let month = `${date.getMonth()}`.length > 1 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}` ;
                    let year = `${date.getFullYear()}` ;
                    let max = +(year + month + day) ;
                    let order = idfilteredOrder.filter(e => {
                        if(`${e.date}`.length > 1) {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}${e.date}`) >= min && +(`${e.year}${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}${e.date}`) >= min && +(`${e.year}0${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        } else {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}0${e.date}`) >= min && +(`${e.year}${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}0${e.date}`) >= min && +(`${e.year}0${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        };
                    });
                    setOrderData([...order]);
                };
            } else {
                if(maxDate) {
                    let max = +(maxDate.replaceAll('-',''));
                    let order = idfilteredOrder.filter(e => {
                        if(`${e.date}`.length > 1) {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        } else {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        };
                    });
                    setOrderData([...order]);
                } else {
                    setOrderData([...idfilteredOrder]);
                };    
            }
        }
    }, [minDate, maxDate, idfilteredOrder]);

    useEffect(() => {
        if(orderData.length > 0) {
            let sumPrice = 0;
            orderData.forEach(e => {
                sumPrice += e.totalPrice;
            });

            setTotalValue(orderData.length.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').slice(0, orderData.length.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').length - 3));
            setTotalPrice(sumPrice.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}));
        } else {
            setTotalValue(0);
            setTotalPrice(0);
        };
    }, [orderData]);

    useEffect(() => {
        if(orderData.length > 0 && sort) {
            if(sort === 'Last Updated') {
                let data = [...orderData];
                data.sort((a, b) => {
                    let aDate;
                    let bDate;
                    if(`${a.date}`.length > 1) {
                        if(`${a.month}`.length > 1) {
                            aDate = `${a.year}${a.month}${a.date}`
                        } else {
                            aDate = `${a.year}0${a.month}${a.date}`
                        };
                    } else {
                        if(`${a.month}`.length > 1) {
                            aDate = `${a.year}${a.month}0${a.date}`
                        } else {
                            aDate = `${a.year}0${a.month}0${a.date}`
                        };
                    };

                    if(`${b.date}`.length > 1) {
                        if(`${b.month}`.length > 1) {
                            bDate = `${b.year}${b.month}${b.date}`
                        } else {
                            bDate = `${b.year}0${b.month}${b.date}`
                        };
                    } else {
                        if(`${b.month}`.length > 1) {
                            bDate = `${b.year}${b.month}0${b.date}`
                        } else {
                            bDate = `${b.year}0${b.month}0${b.date}`
                        };
                    };
                    return bDate - aDate
                });
                setOrderData([...data]);
            } else if(sort === 'Price') {
                let data = [...orderData];
                data.sort((a, b) => b.totalPrice - a.totalPrice);
                setOrderData([...data]);
            } else if(sort === 'Quantity') {
                let data = [...orderData];
                data.sort((a, b) => b.quantity - a.quantity);
                setOrderData([...data]);
            } else if(sort === 'Latest') {
                let data = [...orderData];
                data.sort((a, b) => b.id - a.id);
                setOrderData([...data]);
            };
            setSort();
        };
    }, [sort, orderData]);


 
    return <>
        <div>
            <div className='adminOrderPage'>
                
                {orderPanel}

                <div className='adminOrderPageFilterBox'>
                    <button className='adminOrderPageFilterButton' onClick={() => {
                        resetButton();
                        setPrepareShippingButtonDis('none');
                        setPrepareShippingActiveButtonDis();
                        setOrderData(allOrder.filter(e => e.status === 'PREPARE_SHIPPING'));
                        setFilteredOrder(allOrder.filter(e => e.status === 'PREPARE_SHIPPING'));
                    }} style = {{display: prepareShippingButtonDis}} >Prepare shipping</button>
                    <button className='adminOrderPageFilterActiveButton'  onClick={() => {
                        resetButton();
                        setPrepareShippingButtonDis();
                        setPrepareShippingActiveButtonDis('none');
                        setOrderData(allOrder);
                        setFilteredOrder(allOrder);
                    }} style = {{display: prepareShippingActiveButtonDis}} >Prepare shipping</button>
                    <button className='adminOrderPageFilterButton'  onClick={() => {
                        resetButton();
                        setOnDeliveryButtonDis('none');
                        setOnDeliveryActiveButtonDis();
                        setOrderData(allOrder.filter(e => e.status === 'ON_DELIVERY'));
                        setFilteredOrder(allOrder.filter(e => e.status === 'ON_DELIVERY'));
                    }} style = {{display: onDeliveryButtonDis}} >On delivery</button>
                    <button className='adminOrderPageFilterActiveButton' onClick={() => {
                        resetButton();
                        setOnDeliveryButtonDis();
                        setOnDeliveryActiveButtonDis('none');
                        setOrderData(allOrder);
                        setFilteredOrder(allOrder);
                    }} style = {{display: onDeliveryActiveButtonDis}} >On delivery</button>
                    <button className='adminOrderPageFilterButton' onClick={() => {
                        resetButton();
                        setReceivedButtonDis('none');
                        setReceivedActiveButtonDis();
                        setOrderData(allOrder.filter(e => e.status === 'RECEIVED'));
                        setFilteredOrder(allOrder.filter(e => e.status === 'RECEIVED'));
                    }} style = {{display: receivedButtonDis}} >Received</button>
                    <button className='adminOrderPageFilterActiveButton' onClick={() => {
                        resetButton();
                        setReceivedButtonDis();
                        setReceivedActiveButtonDis('none');
                        setOrderData(allOrder);
                        setFilteredOrder(allOrder);
                    }} style = {{display: receivedActiveButtonDis}} >Received</button>
                    <button className='adminOrderPageFilterButton' onClick={() => {
                        resetButton();
                        setCancleButtonDis('none');
                        setCancleActiveButtonDis();
                        setOrderData(allOrder.filter(e => e.status === 'CANCLE' || e.status === 'PENDING_REFUND' || e.status === 'REFUNDED'));
                        setFilteredOrder(allOrder.filter(e => e.status === 'CANCLE' || e.status === 'PENDING_REFUND' || e.status === 'REFUNDED'));
                    }} style = {{display: cancleButtonDis}} >Cancle</button>
                    <button className='adminOrderPageFilterActiveButton' onClick={() => {
                        resetButton();
                        setCancleButtonDis();
                        setCancleActiveButtonDis('none');
                        setOrderData(allOrder);
                        setFilteredOrder(allOrder);
                    }} style = {{display: cancleActiveButtonDis}} >Cancle</button>
                   
                    <input className='adminFilterOrderInput' placeholder='Find by Order Id' value={orderIdInput} onChange={e => setOrderIdInput(e.target.value)}/>
                    <input className='adminFilterOrderInput' type='date' value={minDate} onChange={e => setMinDate(e.target.value)}/>
                    <FontAwesomeIcon icon={faRightLong} />
                    <input className='adminFilterOrderInput' type='date' value={maxDate} onChange={e => setMaxDate(e.target.value)}/>
                    
                    <div className='adminOrderSortButton' onClick={() => setSortMenuDis()}><FontAwesomeIcon icon={faArrowUpWideShort} /></div>
                    <div className='adminOrderSortMenuBox' style={{display: sortMenuDis}} onMouseLeave={() => setSortMenuDis('none')} >
                        <div onClick={() => setSort('Latest')}>Latest</div>
                        <div onClick={() => setSort('Price')}>Price</div>
                        <div onClick={() => setSort('Quantity')}>Quantity</div>
                        <div onClick={() => setSort('Last Updated')}>Last Updated</div>
                    </div>
                </div>
                <div className='orderBoxHeader'>
                    <div className='headerOrderRow'>
                            <div className='orderRowId'> Id </div>
                            <div className='orderProduct'> Product </div>
                            <div className='orderOption'> Option </div>
                            <div className='orderShippingOption'> Shipping Option </div>
                            <div className='orderTotalPrice'> Total Price </div>
                            <div className='orderStatus'> Status </div>
                        </div>
                        
                        <div className='orderBox'>
                        {orderData?.map((e) => 
                            <div key = {e.id} className='orderRow' onClick={() => {
                                setOrderPanel(<AdminOrderPanel orderData = {e} setStatus = {props.setStatus} setOrderPanel = {setOrderPanel}/>);
                                }}>
                                <div className='orderRowId'> {e.id} </div>
                                <div className='orderProduct'> {e.productName} </div>
                                <div className='orderOption'> {e.productOption} </div>
                                <div className='orderShippingOption'> {e.shippingOption} </div>
                                <div className='orderTotalPrice'> {e.totalPrice.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})} </div>
                                <div className='orderStatus'> {e.status} </div>
                            </div>
                        )}
                    </div>
                    
                    <div className='adminOrderStaticBox'>
                        <div> Total Orders: {totalValue}</div>
                        <div> Total Price: {totalPrice}</div>
                    </div>
                </div>
            </div>
        </div>
    </>
    
};

export default AdminOrderPage