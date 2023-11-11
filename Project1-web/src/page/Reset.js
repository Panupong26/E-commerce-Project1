import '../CSS-file/page-css/reset.css';
import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from 'react';
import axios from '../config/Axios';
import { useSearchParams } from 'react-router-dom';
import localStorage from '../tokenCheck/localStorage';
import { FONTEND_URL } from '../env';
import { handleErr } from '../handle-err/HandleErr';
import { loadingContext } from '../context/LoadingContextProvider';
import { resetValidate } from '../validator/Validator';

function Reset() {
 // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();
    const [ref, setRef] = useState();
 
    const [status, setStatus] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [rePassword, setRePassword] = useState();

    const { setIsLoading } = useContext(loadingContext);

    const [errMsg, setErrMsg] = useState();

    const [inputPassword, setInputPassword] = useState({
        type: 'password',
        typeRe: 'password',
        eyeSlashDis: 'inline-block', 
        eyeDis: 'none',
        eyeSlashDisRe: 'inline-block', 
        eyeDisRe: 'none'
    });

    async function resetPassword() {
        setIsLoading(true);

        if(status === 'admin') {
            await axios.patch(`/admin/adminreset`, {
                ref:  searchParams.get('ref'),
                password: password
            })
            .then(() => {
                localStorage.removeToken();
                window.location.replace(`${FONTEND_URL}/admin`);
            })
            .catch((err) => {
                handleErr(err);
            });
        } else if(status === 'user') {
            await axios.patch(`/user/userreset`, {
                ref: searchParams.get('ref'),
                password: password
            })
            .then(() => {
                localStorage.removeToken();
                window.location.replace(`${FONTEND_URL}/login`);
            })
            .catch((err) => {
                handleErr(err);
            });
        } else if(status === 'seller') {
            await axios.patch(`/seller/sellerreset`, {
                ref: searchParams.get('ref'),
                password: password
            })
            .then(() => {
                localStorage.removeToken();
                window.location.replace(`${FONTEND_URL}/seller`);
            })
            .catch((err) => {
                handleErr(err);
            });
        } 
        setIsLoading(false);    
    };

    function submit() {
        if(resetValidate(password, rePassword)) {    
            setErrMsg({...resetValidate(password, rePassword)});
            return;
        }  

        setErrMsg({...resetValidate(password, rePassword)});
        
        resetPassword();
    }


    useEffect(() => {
        document.title = 'Reset Password';
       
        if(searchParams) {
            setRef(searchParams.get('ref'));
        } else {
            window.location.replace(FONTEND_URL);
        }
    
    },[searchParams]);

    useEffect(() => {
        async function getRefData() {
            await axios.post(`/reset/getrefdata`, {ref: ref})
            .then(res => {
                if(res.data.user) {
                    setStatus('user');
                    setUsername(res.data.user.email);
                }
                if(res.data.seller) {
                    setStatus('seller');
                    setUsername(res.data.seller.email);
                }
                if(res.data.admin) {
                    setStatus('admin');
                    setUsername(res.data.admin.username);
                }
            })
            .catch(err => {
                handleErr(err);
            })
        }

        if(ref) {
            getRefData();
        }

    }, [ref])



    if(username) {
        return (
            <div>
                <div className='resetPage'>
                    <div className='resetBox'>
                        <input name='username' type={'text'} value={username} disabled={true}/>
                        <div className='resetInputPassword' style={{borderColor: `${errMsg?.password? 'red' : '' }`}}>
                            <input 
                                name='password' 
                                type={inputPassword.type} 
                                placeholder='New Password' 
                                value={password} 
                                onChange = {(e) => setPassword(e.target.value)}
                            />
                            {errMsg?.password && <span className='errMessage'>{errMsg?.password}</span>}
                            
                            <button style={{display: inputPassword.eyeSlashDis}} onClick = {() => setInputPassword((prev) => {return{...prev,type: 'text', eyeDis: 'inline-block', eyeSlashDis: 'none'}})}><FontAwesomeIcon icon={faEyeSlash} /></button>
                            <button style={{display: inputPassword.eyeDis}} onClick = {() => setInputPassword((prev) => {return{...prev,type: 'password', eyeDis: 'none', eyeSlashDis: 'inline-block'}})}><FontAwesomeIcon icon={faEye} /></button>
                        </div>
                        
                        <div className='resetInputPassword' style={{borderColor: `${errMsg?.confirmPassword? 'red' : '' }`}}>
                            <input 
                                name='password' 
                                type={inputPassword.typeRe} 
                                placeholder='Re-type New Password' 
                                value={rePassword} 
                                onChange = {(e) => setRePassword(e.target.value)}
                            />
                            {errMsg?.confirmPassword && <span className='errMessage'>{errMsg?.confirmPassword}</span>}

                            <button style={{display: inputPassword.eyeSlashDisRe}} onClick = {() => setInputPassword((prev) => {return{...prev,typeRe: 'text', eyeDisRe: 'inline-block', eyeSlashDisRe: 'none'}})}><FontAwesomeIcon icon={faEyeSlash} /></button>
                            <button style={{display: inputPassword.eyeDisRe}} onClick = {() => setInputPassword((prev) => {return{...prev,typeRe: 'password', eyeDisRe: 'none', eyeSlashDisRe: 'inline-block'}})}><FontAwesomeIcon icon={faEye} /></button>
                        </div>
                        
                        <div className='resetButtonBox'>
                            <button className='resetPageButton' onClick={() => submit()}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default Reset;