import { API_URL } from "../env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons"; 
import { timeAgo } from "../config/TimeAgo";
import "../CSS-file/component-css/comment.css";

export default function Comment({ data }) { 


    const getUserProfilePic = () => {
        if(data?.user) {
            if(data.user.profilePicture) {
                return `${API_URL}/userprofilepic/${data.user.profilePicture}`;
            } else {
                return `${API_URL}/userprofilepic/default.png`;
            }
        } else {
            return `${API_URL}/userprofilepic/notfound`;
        }
    }

    const getUserName = () => {
        if(data?.user) {
            if(data.user.profileName.length > 14) {
                return data.user.profileName.slice(0,13) + '...';
            } else {
                return data.user.profileName;
            };
        } else {
            return '[Deleted Account]'
        };
    }



    return <>
        <div className='productComment'>
            <div className='userComment'>
                <img src={getUserProfilePic()} alt='user'/>
                <div className='commentUsername'>{getUserName()}</div>
                <div className='commentDate'>{timeAgo.format(new Date(`${data.year}-${data.month}-${data.date} ${data.hour}:${data.minute}`))}</div>
            </div>
            <div className='commentValue'>
                {data.reviewMessage} 
            </div>
            <div className='commentStar'>
            {[1,2,3,4,5].map(star => {
                if(star <= data.reviewStar) {
                    return <FontAwesomeIcon icon={faStar} style={{color: "#00bfff",}} />
                } else {
                    return <FontAwesomeIcon icon={faStar} style={{color: "#b7b9bd",}} />
                }
            })} 
            </div>
        </div>
    </>
}
