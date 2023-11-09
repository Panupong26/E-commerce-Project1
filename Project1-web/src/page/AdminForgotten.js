
import '../CSS-file/page-css/admin-forgotten.css';
import React, { useContext } from 'react';
import {useEffect, useState} from 'react';
import axios from '../config/Axios';
import { FONTEND_URL } from '../env';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';

function AdminForgotten() {
    const [username, setUsername] = useState();
    const [createButtonDisable, setCreateButtonDisable] = useState('none');
    const { setIsLoading } = useContext(loadingContext);
   

    async function resetPassword() {
        setIsLoading(true);
        await axios.post(`/admin/guestcreatereset`, {
            username: username
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
        if(username) {
            setCreateButtonDisable();   
        } else {
            setCreateButtonDisable('none');
        }
    },[username]);


    return (
        <div>
            <div className='adminForgottenPage'>
                <div className='adminForgottenBox'>
                    <input name='username' type={'text'} placeholder='Username' value={username} onChange = {e => setUsername(e.target.value)}/>
                    <div className='adminForgottenButtonBox'>
                        <button className='adminForgottenPageButton' style={{pointerEvents: createButtonDisable}} onClick={() => resetPassword()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminForgotten;