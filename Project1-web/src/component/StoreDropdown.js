import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faXmark, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram} from '@fortawesome/free-brands-svg-icons';
import "../CSS-file/component-css/detail-dropdown.css";

export default function StoreDropdown({ shopData, setOpen }) {

    return <>
         <div className='storeDetail'>
            <div className='storeDescription'>
                    <div className='storeDescriptionHead'>Description</div>  
                    <div className='storeDescriptionMessage'>{shopData?.storeDescription}</div>
            </div>
            <div className='storeContact'>
                <div className='storeContactHead'>Contact</div>
                <div className='storeCloseStoreDetail' onClick={() => setOpen(false)}><FontAwesomeIcon icon={faXmark} />
            </div>
                <div>
                    {shopData?.phoneNumber && <div className='storeContactPlatform'><div className='icon'><FontAwesomeIcon icon={faPhone} /></div>{shopData?.phoneNumber}</div>}
                    {shopData?.facebook && <div className='storeContactPlatform'><div className='icon'><FontAwesomeIcon icon={faFacebookF} /></div>{shopData?.facebook}</div>}
                    {shopData?.instagram && <div className='storeContactPlatform'><div className='icon'><FontAwesomeIcon icon={faInstagram} /></div>{shopData?.instagram}</div>}
                    {
                    shopData?.address && <div className='storeAddressPlatform'>
                        <div className='icon'><FontAwesomeIcon icon={faLocationDot} /></div>
                        <div className='shopAddress'>{shopData?.address}</div>
                    </div>
                    }
                </div>
            </div>
        </div>
    </>
}