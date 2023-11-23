import '../CSS-file/page-css/admin-bill.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import axios from '../config/Axios';
import {  useEffect, useState } from 'react';
import AdminBillPanel from '../modals/AdminBillPanel';
import { handleErr } from '../handle-err/HandleErr';



function AdminBillPage(props) {
    const [billData, setBillData] = useState([]);
    const [allBill, setAllBill] = useState();
    const [filteredBill, setFilteredBill] = useState();
    const [billIdInput, setBillIdInput] = useState();
    const [idfilteredBill, setIdFilteredBill] = useState();
    const [sort, setSort] = useState();
    const [minDate, setMinDate] = useState();
    const [maxDate, setMaxDate] = useState();
    const [totalValue, setTotalValue] = useState();
    const [totalInvoice, setTotalInvoice] = useState();

    const [notYetSubmittedButtonDis,setNotYetSubmittedButtonDis] = useState();
    const [notYetSubmittedActiveButtonDis,setNotYetSubmittedActiveButtonDis] = useState('none');
    const [pendingButtonDis,setPendingButtonDis] = useState();
    const [pendingActiveButtonDis,setPendingActiveButtonDis] = useState('none');
    const [paidButtonDis,setPaidButtonDis] = useState();
    const [paidActiveButtonDis,setPaidActiveButtonDis] = useState('none');

    const [billPanel, setBillPanel] = useState();
    const [sortMenuDis, setSortMenuDis] = useState('none');

    async function getBill() {
        await axios.get(`/bill/getallbill`)
        .then(res => {
            setBillData([...res.data]);
            setAllBill([...res.data]);
            setFilteredBill([...res.data]);
        })
        .catch(err => {
           handleErr(err);
        })
    };



    function resetButton() {
        setNotYetSubmittedButtonDis();
        setNotYetSubmittedActiveButtonDis('none');
        setPendingButtonDis();
        setPendingActiveButtonDis('none');
        setPaidButtonDis();
        setPaidActiveButtonDis('none');
    };


    useEffect(() => {
        document.title = 'Invoice';
        getBill();
    }, [])

    useEffect(() => {
        if(filteredBill) {
            if(billIdInput) {
                setIdFilteredBill(filteredBill.filter(e => e.id === +billIdInput));       
            } else {
                setIdFilteredBill([...filteredBill]);
            };
        };
    }, [billIdInput, filteredBill])

    useEffect(() => {
        if(idfilteredBill) {
            if(minDate) {
                if(maxDate) {
                    let min = +(minDate.replaceAll('-',''));
                    let max = +(maxDate.replaceAll('-',''));
                    let bill = idfilteredBill.filter(e => {
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
                    setBillData([...bill]);
                } else {
                    let min = +(minDate.replaceAll('-',''));
                    let date = new Date();
                    let day = `${date.getDate()}`.length > 1 ? `${date.getDate()}` : `0${date.getDate()}` ;
                    let month = `${date.getMonth()}`.length > 1 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}` ;
                    let year = `${date.getFullYear()}` ;
                    let max = +(year + month + day) ;
                    let bill = idfilteredBill.filter(e => {
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
                    setBillData([...bill]);
                };
            } else {
                if(maxDate) {
                    let max = +(maxDate.replaceAll('-',''));
                    let bill = idfilteredBill.filter(e => {
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
                    setBillData([...bill]);
                } else {
                    setBillData([...idfilteredBill]);
                };    
            }
        }
    }, [minDate, maxDate, idfilteredBill]);

    useEffect(() => {
        if(billData.length > 0) {
            let sumInvoice = 0;
            billData.forEach(e => {
                sumInvoice += e.totalIncome;
            });

            setTotalValue(billData.length.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').slice(0, billData.length.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').length - 3));
            setTotalInvoice(sumInvoice.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}));
        } else {
            setTotalValue(0);
            setTotalInvoice(0);
        };
    }, [billData]);

    useEffect(() => {
        if(billData.length > 0 && sort) {
            if(sort === 'Last Updated') {
                let data = [...billData];
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
                setBillData([...data]);
            } else if(sort === 'Invoice Value') {
                let data = [...billData];
                data.sort((a, b) => b.totalIncome - a.totalIncome);
                setBillData([...data]);
            } else if(sort === 'Latest') {
                let data = [...billData];
                data.sort((a, b) => b.id - a.id);
                setBillData([...data]);
            };
            setSort();
        };
    }, [sort, billData]);


    return <>
        <div>
            <div className='adminBillPage'>
                {billPanel}

            <div className='adminBillPageFilterBox'>
                <button className='adminBillPageFilterButton' onClick={() => {
                    resetButton();
                    setNotYetSubmittedButtonDis('none');
                    setNotYetSubmittedActiveButtonDis();
                    setBillData(allBill.filter(e => e.status === 'NOT_YET_SUBMITTED'));
                    setFilteredBill(allBill.filter(e => e.status === 'NOT_YET_SUBMITTED'));
                }} style = {{display: notYetSubmittedButtonDis}} >Not Yet Submitted</button>
                <button className='adminOrderPageFilterActiveButton'  onClick={() => {
                    resetButton();
                    setNotYetSubmittedButtonDis();
                    setNotYetSubmittedActiveButtonDis('none');
                    setBillData(allBill);
                    setFilteredBill(allBill);
                }} style = {{display: notYetSubmittedActiveButtonDis}} >Not Yet Submitted</button>
                <button className='adminOrderPageFilterButton'  onClick={() => {
                    resetButton();
                    setPendingButtonDis('none');
                    setPendingActiveButtonDis();
                    setBillData(allBill.filter(e => e.status === 'PENDING'));
                    setFilteredBill(allBill.filter(e => e.status === 'PENDING'));
                }} style = {{display: pendingButtonDis}} >Pending</button>
                <button className='adminOrderPageFilterActiveButton' onClick={() => {
                    resetButton();
                    setPendingButtonDis();
                    setPendingActiveButtonDis('none');
                    setBillData(allBill);
                    setFilteredBill(allBill);
                }} style = {{display: pendingActiveButtonDis}} >Pending</button>
                <button className='adminOrderPageFilterButton' onClick={() => {
                    resetButton();
                    setPaidButtonDis('none');
                    setPaidActiveButtonDis();
                    setBillData(allBill.filter(e => e.status === 'PAID'));
                    setFilteredBill(allBill.filter(e => e.status === 'PAID'));
                }} style = {{display: paidButtonDis}} >Paid</button>
                <button className='adminOrderPageFilterActiveButton' onClick={() => {
                    resetButton();
                    setPaidButtonDis();
                    setPaidActiveButtonDis('none');
                    setBillData(allBill);
                    setFilteredBill(allBill);
                }} style = {{display: paidActiveButtonDis}} >Paid</button>
                <input className='adminFilterBillInput' placeholder='Find by Bill Id' value={billIdInput} onChange={e => setBillIdInput(e.target.value)}/>
                <input className='adminFilterBillInput' type='date' value={minDate} onChange={e => setMinDate(e.target.value)}/>
                <FontAwesomeIcon icon={faRightLong} />
                <input className='adminFilterBillInput' type='date' value={maxDate} onChange={e => setMaxDate(e.target.value)}/>
                <div className='adminBillSortButton' onClick={() => setSortMenuDis()}><FontAwesomeIcon icon={faArrowUpWideShort} /></div>
                <div className='adminBillSortMenuBox' style={{display: sortMenuDis}} onMouseLeave={() => setSortMenuDis('none')} >
                    <div onClick={() => setSort('Latest')}>Latest</div>
                    <div onClick={() => setSort('Invoice Value')}>Invoice Value</div>
                    <div onClick={() => setSort('Last Updated')}>Last Updated</div>
                </div>
            </div>
            
            
                <div className='billBoxHeader'>
                    <div className='headerBillRow'>
                            <div className='adminBillRowId'> Id </div>
                            <div className='adminBillOrderId'> Order Id </div>
                            <div className='adminBillProduct'> Product </div>
                            <div className='adminBillOption'> Option </div>
                            <div className='adminBillInvoice'> Invoice </div>
                            <div className='adminBillStatus'> Status </div>
                    </div>
                    
                    <div className='adminBillBox'>
                        {billData?.map((e) => 
                            <div key = {e.id} className='billRow' onClick={() => {
                                setBillPanel(<AdminBillPanel billData = {e} setBillPanel = {setBillPanel} allBill = {allBill} setAllBill = {setAllBill}/>);
                            }}>
                                <div className='adminBillRowId'> {e.id} </div>
                                <div className='adminBillOrderId'> {e.orderId} </div>
                                <div className='adminBillProduct'> {e?.productName.length > 12 ? e.productName.slice(0,11) + '...' : e.productName} </div>
                                <div className='billadminBillOption'> {e.productOption} </div>
                                <div className='adminBillInvoice'> {e.totalIncome.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})} </div>
                                <div className='adminBillStatus'> {e.status} </div>
                            </div>
                        )}
                    </div>

                    <div className='adminBillStaticBox'>
                        <div> Total Orders: {totalValue}</div>
                        <div> Total Invoice: {totalInvoice}</div>
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default AdminBillPage