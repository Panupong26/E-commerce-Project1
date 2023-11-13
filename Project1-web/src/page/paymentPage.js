import axios from "../config/Axios";
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import { FONTEND_URL } from "../env";
import { loadingContext } from "../context/LoadingContextProvider";
import { handleErr } from "../handle-err/HandleErr";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import "../CSS-file/page-css/payment.css"



export default function PaymentPage() {
    document.title = 'Payment successful';
    
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();

    const { setIsLoading } = useContext(loadingContext);


    async function createorder() {
        setIsLoading(true);
        
        await axios.post('payment/createorder', {ref: searchParams.get('ref')})
        .then(() => {
            window.location.replace(`${FONTEND_URL}/profile/myorders`);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        if(searchParams.get('ref') === 'bringback') {
            window.history.back(-2);
        }
    }, [searchParams]);

    
    return <>
        <div className='paymentPage'>
            <div className='paymentPageMsgBox'>
                <div className='paymentPageIcon'><FontAwesomeIcon icon={faCircleCheck} style={{color: "#b3e548"}}/></div>
                <div className='paymentPageMsg'>PAYMENT SUCCESSFUL</div>
                <div className='paymentPageButton' onClick={() => createorder()}>OK</div>
            </div>       
        </div>
    </>
}