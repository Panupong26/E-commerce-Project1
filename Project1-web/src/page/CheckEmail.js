
import '../CSS-file/page-css/check-email.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeCircleCheck} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from 'react';
import { useSearchParams } from 'react-router-dom';


function CheckEmail() {
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [event, setEvent] = useState();

    useEffect(() => {
        document.title = 'Email has been sent';
    }, [])

    useEffect(() => {
        if(searchParams) {
            setEmail(searchParams.get('email'));
            setEvent(searchParams.get('event'));
        }
    }, [searchParams])

    if(event && event === 'verification') {
        return (
            <div>
                <div className='checkEmailPage'>
                    <div className='ceMsgBox'>
                        <div className='icon'><FontAwesomeIcon icon={faEnvelopeCircleCheck} /></div>
                        <div className='msg'>A verification email has been send to <b>{email}</b>, Please check your mailbox to verify account before you sign in</div>
                    </div>
                </div>
            </div>
        );
    } else if(event && event === 'resetpassword') {
        return (
            <div>
                <div className='checkEmailPage'>
                    <div className='ceMsgBox'>
                        <div className='icon'><FontAwesomeIcon icon={faEnvelopeCircleCheck} /></div>
                        <div className='msg'>A reset link has been send to <b>your email</b>, Please check your mailbox to reset your password</div>
                    </div>
                </div>
            </div>
        );
    };
    
};

export default CheckEmail;