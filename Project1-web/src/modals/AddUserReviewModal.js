import '../CSS-file/modal-css/add-review.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import axios from '../config/Axios';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';

function AddUserReviewModal(props) {
    const [userReview, setUserReview] = useState('');
    const [givenStar, setGivenStar] = useState(0);
    const [starButton, setStarButton] = useState({
        star1: "#b7b9bd",
        star2: "#b7b9bd",
        star3: "#b7b9bd",
        star4: "#b7b9bd",
        star5: "#b7b9bd",
    })

    const [addUserReviewButtonDisable, setAddUserReviewButtonDisable] = useState(true);
    const { setIsLoading } = useContext(loadingContext);

    async function addReview() {
        setIsLoading(true);
        await axios.post(`/review/createreview`, {
            productId: props.productId,
            orderId: props.orderId,
            reviewMessage: userReview,
            reviewStar: givenStar
        })
        .then(async () => {
            props.setIsOpen(false);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function userUpdateOrder() {
        setIsLoading(true);
        
        await axios.put(`/order/userupdateorder`, {
                orderId: props.orderId
        })
        .then(() => {
            const updatedOrder = [...props.orderData].find(el => el.id === props.orderId);
            updatedOrder.status = 'RECEIVED';
            const newArr = [...props.orderData];
            const index = [...props.orderData].findIndex(el => el.id === props.orderId);
            newArr[index] = updatedOrder; 
            props.setOrderData([...newArr]);
            props.setIsOpen(false);
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        for(let i = 1 ; i <= 5; i++) {
            if(i <= givenStar) {
                setStarButton((prev) => {return{...prev, [`star${i}`]:'#00bfff'}});
            } else {
                setStarButton((prev) => {return{...prev, [`star${i}`]:'#b7b9bd'}});
            }
        };
        if(givenStar === 0) {
            setAddUserReviewButtonDisable(true);
        } else {
            setAddUserReviewButtonDisable(false);
        }
    },[givenStar])


    return (
        <div className="modal-bg" onClick = {() => props.setIsOpen(false)} >
            <div className='addUserReviewBox' onClick = {e => e.stopPropagation()}>
                <div className='starBox'>
                    <button style={{color: starButton.star1}} onClick = {() => setGivenStar(1)}><FontAwesomeIcon icon={faStar}/></button>
                    <button style={{color: starButton.star2}} onClick = {() => setGivenStar(2)}><FontAwesomeIcon icon={faStar}/></button>
                    <button style={{color: starButton.star3}} onClick = {() => setGivenStar(3)}><FontAwesomeIcon icon={faStar}/></button>
                    <button style={{color: starButton.star4}} onClick = {() => setGivenStar(4)}><FontAwesomeIcon icon={faStar}/></button>
                    <button style={{color: starButton.star5}} onClick = {() => setGivenStar(5)}><FontAwesomeIcon icon={faStar}/></button>
                </div>
                <div className='addCommentBox'>
                    <textarea value={userReview} placeholder = 'Add your comment...' onChange={(e) => setUserReview(e.target.value)}/>
                </div>
                <div className='addUserReviewButtonBox'>
                    <button onClick={() => {
                        addReview();
                        userUpdateOrder();
                    }} disabled = {addUserReviewButtonDisable} >Add</button>
                    <button onClick={() => userUpdateOrder()}>Next time</button>
                    <button onClick={() => props.setIsOpen(false)}>Cancle</button>
                </div>
            </div>
        </div>
    )
}

export default AddUserReviewModal