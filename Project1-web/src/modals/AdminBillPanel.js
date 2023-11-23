import axios from "../config/Axios";
import { useContext, useEffect, useState } from "react";
import '../CSS-file/modal-css/admin-bill-modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStore, faMoneyCheck, faPhone, faEnvelope, faBank } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram} from '@fortawesome/free-brands-svg-icons';
import { handleErr } from "../handle-err/HandleErr";
import { loadingContext } from "../context/LoadingContextProvider";
import { FONTEND_URL } from "../env";
import { authContext } from "../context/AuthContextProvider";






function AdminBillPanel(props) {
    const { authUser } = useContext(authContext);
    // eslint-disable-next-line
    const [billData, setBillData] = useState(props.billData);
    const [paymentRef, setPaymentRef] = useState();
    const [adminBillButtonDis, setAdminBillButtonDis] = useState();

    const { setIsLoading } = useContext(loadingContext);


    async function adminUpdateBill() {
        setIsLoading(true);

        await axios.patch(`/bill/adminupdatebill`, {billId: billData.id, ref: paymentRef})
        .then(res => {
            const allBill = [...props.allBill];
            const index = allBill.findIndex(e => e.id === billData.id);
            allBill[index].status = 'PAID' ;
            allBill[index].ref = paymentRef ;
            allBill[index].admin = {username: authUser.username} ;
            props.setAllBill([...allBill]);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            props.setBillPanel();
            setIsLoading(false);
        })
    };

    function goToStorePage() {
        if(billData?.seller) {
            window.open(`${FONTEND_URL}/shop/${billData.seller.storeName}`, '_Blank')
        }; 
    };

    function getLastUpdate() {
        if(`${billData?.date}`.length > 1) {
            if(`${billData?.month}`.length > 1) {
                return `${billData.date}/${billData.month}/${billData.year}`;
            } else {
                return `${billData.date}/0${billData.month}/${billData.year}`;
            };
        } else {
            if(`${billData?.month}`.length > 1) {
                return `0${billData.date}/${billData.month}/${billData.year}`;
            } else {
                return `0${billData?.date}/0${billData?.month}/${billData?.year}`;
            };
        };
    }

    useEffect(() => {
        if(paymentRef) {
            setAdminBillButtonDis();
        } else {
            setAdminBillButtonDis('none');
        }
    }, [paymentRef]);


    return <>
        <div className="modal-bg" onClick={() => props.setBillPanel()}>
            <div className="billPanel" onClick={e => e.stopPropagation()}>
                <div className="adminBillStatus">Status: {billData?.status}</div>
                <div className="billInfo">
                    <div className="billTextBox">
                        <div className="textHeader">Invoice</div>
                        <div className="adminOrderText">Id: {billData?.id}</div>
                        <div className="adminOrderText">Order Id: {billData?.id}</div>
                        <div className="adminOrderText">Product: {billData?.productName}</div>
                        <div className="adminOrderText">Option: {billData?.productOption}</div>
                        <div className="adminOrderText">Shipping Option: {billData?.shippingOption}</div>
                        <div className="adminOrderText">Quantity: {billData?.quantity}</div>
                        <div className="adminOrderText">Invoice: {billData?.totalIncome.toLocaleString('th-TH', {style: 'currency', currency: 'THB'})}</div>
                        <div className="adminOrderText">Last Updated: {getLastUpdate()}</div>
                        {billData?.ref && 
                        <>
                            <div className="adminOrderText">Ref. {billData?.ref}</div>
                            <div className="adminOrderText">By {billData?.admin? billData.admin.username : '[Deleted Account]'}</div>
                        </>
                        }
                    </div>
                    <div className="billTextBox link" onClick={() => goToStorePage()}>
                        <div className="billTextHeader">Seller</div>
                        <div className="adminBillText"><div className="icon"><FontAwesomeIcon icon={faUser}/></div> {billData?.seller?  billData?.seller?.id : '[Deleted Account]' }</div>
                        <div className="adminBillText"><div className="icon"><FontAwesomeIcon icon={faStore}/></div>  {billData?.seller?.storeName}</div>
                        <div className="adminBillText"><div className="icon"><FontAwesomeIcon icon={faFacebookF}/></div> {billData?.seller?.facebook}</div>
                        <div className="adminBillText"><div className="icon"><FontAwesomeIcon icon={faInstagram}/></div> {billData?.seller?.instagram}</div>
                        <div className="adminBillText"><div className="icon"><FontAwesomeIcon icon={faEnvelope}/></div> {billData?.seller?.email}</div>
                        <div className="adminBillText"><div className="icon"><FontAwesomeIcon icon={faPhone}/></div> {billData?.seller?.phoneNumber}</div>
                        <div className="adminBillText"><div className="icon"><FontAwesomeIcon icon={faBank}/></div> {billData?.seller?.bankName}</div>
                        <div className="adminBillText" ><div className="icon"><FontAwesomeIcon icon={faMoneyCheck} /></div> {billData?.seller?.bankAccountNumber}</div>
                    </div>
                </div>
                {billData?.status === 'PENDING' && 
                <div className="adminSubmitBillBox">
                    <input className="paymentRefInput" placeholder="Payment's Ref" value={paymentRef} onChange = {e => setPaymentRef(e.target.value)}/>
                    <div className="adminBillButton" style={{pointerEvents: adminBillButtonDis}}  onClick={() => adminUpdateBill()}> Submit </div>
                </div>
                }    
            </div>
        </div>
    </>
    
};

export default AdminBillPanel