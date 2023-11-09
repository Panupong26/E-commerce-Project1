import '../CSS-file/page-css/forgotten.css';
import React, { useContext } from 'react';
import {useEffect, useState} from 'react';
import axios from '../config/Axios';
import { FONTEND_URL } from '../env';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';

function SellerForgotten() {
    const [email, setEmail] = useState();
    const [createButtonDisable, setCreateButtonDisable] = useState('none');

    const { setIsLoading } = useContext(loadingContext);


    async function resetPassword() {
        setIsLoading(true);

        await axios.post(`${window.location.pathname.includes('seller') ? '/seller/guestcreatereset' : `/user/guestcreatereset`}`, {
            email: email
        })
        .then(() => {
            window.location.replace(`${FONTEND_URL}/checkemail?event=resetpassword`);
        })
        .catch((err) => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        document.title = 'Forgotten Password';
    },[])

    useEffect(() => {
        if(email) {
            setCreateButtonDisable();   
        } else {
            setCreateButtonDisable('none');
        }
    },[email]);


    return (
        <div>
            <div className='forgottenPage'>
                <div className='forgottenBox'>
                    <input name='username' type={'text'} placeholder='Email address' value={email} onChange = {e => setEmail(e.target.value)}/>
                    <div className='forgottenButtonBox'>
                        <button className='forgottenPageButton' style={{pointerEvents: createButtonDisable}} onClick={() => resetPassword()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
   
};

export default SellerForgotten;