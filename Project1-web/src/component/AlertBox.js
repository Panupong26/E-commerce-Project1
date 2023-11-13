import { FONTEND_URL } from "../env";
import axios from '../config/Axios';
import { timeAgo } from "../config/TimeAgo";
import { handleErr } from "../handle-err/HandleErr";
import "../CSS-file/component-css/notification.css"

export default function AlertBox ({ open, setOpen, notification, setNotification }) {

    const acceptNotification = async (id) => {
        await axios.delete(`/notification/deletenotification/${id}`)
        .then(() => {
            window.location.href = `${FONTEND_URL}/profile/myorders`; 
        })
        .catch(err => {
            handleErr(err);
        })
    }

    const acceptAllNotification = async () => {
        setNotification([]);

        await axios.delete(`/notification/deleteallnotification`)
        .catch(err => {
            handleErr(err);
        })
    }

    return <>
        <div className="alert-container"  onMouseLeave={() => setOpen({...open, alertBox: false})}>
            <div className='alertBox'>
                {notification?.map(e =>   
                    <div key={e.id} className='notificationCard' onClick={() =>  acceptNotification(e.id, e.notificationType)}>
                        <img src={e.notificationPicture} alt='notification'/>
                        <div className='notificationMessage'>{e.message}</div>
                        <div className='notificationTime'>{timeAgo.format(new Date(`${e.year}-${e.month}-${e.date} ${e.hour}:${e.minute}`))}</div>
                    </div>    
                )}
            </div>
            <div className="accept-all-button" onClick={() => acceptAllNotification()}>Accept all</div>
        </div>
    </>
}