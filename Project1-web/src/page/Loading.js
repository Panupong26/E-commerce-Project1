import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import '../CSS-file/page-css/loading.css';
import { useState, useEffect } from 'react';

function Loading() {
    const [circle, setCircle] = useState([]);
    const [amount, setAmount] = useState(1);

    useEffect(() => {
        setTimeout(() => {
            if(amount < 5) {
                setAmount(amount + 1);
            } else {
                setAmount(1);
            }
        }, 500);
    }, [circle, amount]);

    useEffect(() => {
        let preArr = [];
        for(let i = 1 ; i <= amount ; i++) {
            preArr.push(i);
        };
        setCircle([...preArr]);
    }, [amount]);


    return (
        <div className="loadingPage">
            <div className="circleBox">{circle.map(e => <div key = {e} className='icon'><FontAwesomeIcon icon={faCircle}/></div>)}</div>
        </div>
    )
};

export default Loading