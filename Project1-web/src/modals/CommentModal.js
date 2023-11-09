import Comment from "../component/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import "../CSS-file/modal-css/comment-modal.css";


export default function CommentModal({ commentArr, setOpenComment }) {

    return <>
        <div className="modal-bg" onClick={() => setOpenComment(false)}>
            <div className='reviewBox' onClick={e => e.stopPropagation()}>
                <div className='reviewHeader'><FontAwesomeIcon icon={faComments} /></div>
                <div className='commentBox'>
                    {commentArr?.map((el) => <div key={el.id}><Comment data = {el}/></div>)}
                </div> 
            </div> 
        </div> 
    </>
}