import axios from "../../config/Axios";
import '../../CSS-file/component-css/seller-withdraw.css';
import { useEffect, useState } from "react";
import { FONTEND_URL } from "../../env";
import { handleErr } from "../../handle-err/HandleErr";

const billStatus = {
    NOT_YET_SUBMITTED: 'Not Yet Submitted',
    PENDING: 'Pending',
    PAID: 'Paid'
}

function ShopWithdraw() {
    const [bill, setBill] = useState();
    const [allBill, setAllBill] = useState();
    const [filterButtonDis, setFilterButtonDis] = useState({
        notYetSubmitted: '',
        submitted: '',
        paid: ''
    });
    const [filterActiveButtonDis, setFilterActiveButtonDis] = useState({
        notYetSubmitted: 'none',
        submitted: 'none',
        paid: 'none'
    });

    function clearFilterButton() {
        setFilterButtonDis({
            notYetSubmitted: '',
            submitted: '',
            paid: ''
        });
        setFilterActiveButtonDis({
            notYetSubmitted: 'none',
            submitted: 'none',
            paid: 'none'
        });
    }

   

    async function submitBill(billId) {
        await axios.put(`/bill/sellerupdatebill`, {
            billId: billId
        })
        .then(() => {
            let updatedBill = [...allBill].find(el => el.id === billId);
            updatedBill.status = 'PENDING';
            const newArr = [...allBill];
            const index = [...allBill].findIndex(el => el.id === billId);
            newArr[index] = updatedBill; 
            setAllBill([...newArr]);
        })
        .catch(err => {
            handleErr(err)
        })
    }


    useEffect(() => {
        document.title = 'Withdraw';

        async function getBill() {
            
            await axios.get(`/bill/getbillbysellerid`)
            .then((res) => {
                let bills = [...res.data];
                bills.sort((a, b) => b.id - a.id);
                setBill([...bills]);
                setAllBill([...bills]);
            })
            .catch(err => {
                if(err?.response?.status === 401) {
                    localStorage.removeToken();
                    window.location.replace(`${FONTEND_URL}/seller`);
                }
            })
        };

        getBill();
        // eslint-disable-next-line
    }, []);

    
        return <>
            <div className='billPage'>
                <div className='billFilter'>
                    <div className='billFilterButton' style={{display: filterButtonDis.notYetSubmitted}} onClick = {() => {
                        clearFilterButton();
                        setFilterButtonDis((prev) => {return{...prev, notYetSubmitted: 'none'}});
                        setFilterActiveButtonDis((prev) => {return{...prev, notYetSubmitted: ''}});
                        setBill([...allBill.filter(e => e.status === 'NOT_YET_SUBMITTED')]);
                    }}>Not Yet Submitted</div>
                    <div className='billFilterActiveButton' style={{display: filterActiveButtonDis.notYetSubmitted}} onClick = {() => {
                        clearFilterButton();
                        setFilterButtonDis((prev) => {return{...prev, notYetSubmitted: ''}});
                        setFilterActiveButtonDis((prev) => {return{...prev, notYetSubmitted: 'none'}});
                        setBill([...allBill]);
                    }}>Not Yet Submitted</div>
                    <div className='billFilterButton'style={{display: filterButtonDis.submitted}} onClick = {() => {
                        clearFilterButton();
                        setFilterButtonDis((prev) => {return{...prev, submitted: 'none'}});
                        setFilterActiveButtonDis((prev) => {return{...prev, submitted: ''}});
                        setBill([...allBill.filter(e => e.status === 'PENDING' || e.status === 'PAID')]);
                    }}>Submitted</div>
                    <div className='billFilterActiveButton' style={{display: filterActiveButtonDis.submitted}} onClick = {() => {
                        clearFilterButton();
                        setFilterButtonDis((prev) => {return{...prev, submitted: ''}});
                        setFilterActiveButtonDis((prev) => {return{...prev, submitted: 'none'}});
                        setBill([...allBill]);
                    }}>Submitted</div>
                    <div className='billFilterButton'style={{display: filterButtonDis.paid}} onClick = {() => {
                        clearFilterButton();
                        setFilterButtonDis((prev) => {return{...prev, paid: 'none'}});
                        setFilterActiveButtonDis((prev) => {return{...prev, paid: ''}});
                        setBill([...allBill.filter(e => e.status === 'PAID')]);
                    }}>Paid</div>
                    <div className='billFilterActiveButton' style={{display: filterActiveButtonDis.paid}} onClick = {() => {
                        clearFilterButton();
                        setFilterButtonDis((prev) => {return{...prev, paid: ''}});
                        setFilterActiveButtonDis((prev) => {return{...prev, paid: 'none'}});
                        setBill([...allBill]);
                    }}>Paid</div>
                </div>
                <div className='billHeader'>
                    <div className='headerId'>ID</div>
                    <div className='headerOrderId'>Order ID</div>
                    <div className='headerProductName'>Product</div>
                    <div className='billHeaderOption'>Option</div>
                    <div className='headerAmount'>Amount</div>
                    <div className='headerIncome'>Income</div>
                    <div className='headerIncome'>Status</div>
                </div>
                <div className='billBox'>
                    {bill?.map(e => 
                        <div key={e.id} className='billCard'>
                            <div className='billId'>{e.id}</div>
                            <div className='billOrderId'>{e.orderId}</div>
                            <div className='billProductName'>{e.productName}</div>
                            <div className='billOption'>{e.productOption}</div>
                            <div className='billAmount'>{e.amount}</div>
                            <div className='billIncome'>{e.totalIncome.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})}</div>
                            <div className='billStatus'>{billStatus[e.status]}</div>
                            
                            {e.status === 'NOT_YET_SUBMITTED' && <button onClick={() => submitBill(e.id)}>Submit</button>}    
                        </div>
                    )}
                </div>
            </div>
        </>
    
}

export default ShopWithdraw