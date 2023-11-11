import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import '../CSS-file/page-css/loading.css';
import { useState, useEffect } from 'react';

function Loading() {
    const [circle, setCircle] = useState([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setTimeout(() => {
            if(quantity < 5) {
                setQuantity(quantity + 1);
            } else {
                setQuantity(1);
            }
        }, 500);
    }, [circle, quantity]);

    useEffect(() => {
        let preArr = [];
        for(let i = 1 ; i <= quantity ; i++) {
            preArr.push(i);
        };
        setCircle([...preArr]);
    }, [quantity]);


    return (
        <div className="loadingPage">
            <div className="circleBox">{circle.map(e => <div key = {e} className='icon'><FontAwesomeIcon icon={faCircle}/></div>)}</div>
        </div>
    )
};

export default Loading