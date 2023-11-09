import { FONTEND_URL } from "../env";
import axios from '../config/Axios';
import { timeAgo } from "../config/TimeAgo";
import { handleErr } from "../handle-err/HandleErr";
import "../CSS-file/component-css/notification.css"

export default function AlertBox ({ open, setOpen, notification }) {

    const acceptNotification = async (id, type) => {
        if(type === 'TO_USER_ORDER') {
            await axios.delete(`/notification/deletenotification`, {data: {notificationId: id}})
            .then(() => {
                window.location.href = `${FONTEND_URL}/profile/myorders`; 
            })
            .catch(err => {
                handleErr(err);
            })
        }
        if(type === 'TO_SELLER_ORDER') {
            await axios.delete(`/notification/deletenotification`, {data: {notificationId: id}})
            .then(() => {
                window.location.href = `${FONTEND_URL}/profile/myorders`;
            })
            .catch(err => {
                handleErr(err);
            })  
        }
    }

    return <>
        <div className='alertBox' onMouseLeave={() => setOpen({...open, alertBox: false})}>
            {notification?.map(e =>   
                <div key={e.id} className='notificationCard' onClick={() =>  acceptNotification(e.id, e.notificationType)}>
                    <img src={e.notificationPicture} alt='notification'/>
                    <div className='notificationMessage'>{e.message}</div>
                    <div className='notificationTime'>{timeAgo.format(new Date(`${e.year}-${e.month}-${e.date} ${e.hour}:${e.minute}`))}</div>
                </div>    
            )}
        </div>
    </>
}