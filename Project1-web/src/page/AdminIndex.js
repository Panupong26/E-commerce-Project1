
import '../CSS-file/page-css/admin-index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faReceipt, faBox } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from "react";
import { FONTEND_URL } from "../env";







function AdminIndex() {

    useEffect(() => {
        document.title = 'Index';
    }, [])



    return <>
        <div>
            <div className='adminIndexPage'>
                <div className="adminButtonBox">
                    <div className="adminButton" onClick={() => window.location.href = `${FONTEND_URL}/orders`}> <FontAwesomeIcon icon={faNewspaper} style = {{color: '#50c9f2', fontSize: '80px'}}/> <br/><br/> Orders</div>
                    <div className="adminButton" onClick={() => window.location.href = `${FONTEND_URL}/bills`}> <FontAwesomeIcon icon={faReceipt} style = {{color: '#50c9f2', fontSize: '80px'}}/> <br/><br/> Bills</div>
                    <div className="adminButton" onClick={() => window.location.href = `${FONTEND_URL}/manageproduct`}> <FontAwesomeIcon icon={faBox} style = {{color: '#50c9f2', fontSize: '80px'}}/> <br/><br/> Product</div>
                </div>
            </div>
        </div>
    </>
        
    
}

export default AdminIndex ;