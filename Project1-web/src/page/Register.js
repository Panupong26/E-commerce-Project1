import '../CSS-file/page-css/register.css';
import React, { useContext } from 'react';
import { registerValidate } from '../validator/Validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from 'react';
import axios from '../config/Axios';
import { FONTEND_URL } from '../env';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';

function Register() {
    // Navbar && Userpanel 
    const status = (window.location.pathname.includes('seller')? 'seller' : window.location.pathname.includes('admin')? 'admin' : 'user') 
   
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState();

    const [errMsg, setErrMsg] = useState();

    const { setIsLoading } = useContext(loadingContext);

   
   // Content
    const [inputPassword, setInputPassword] = useState({
        type: 'password',
        typeRe: 'password',
        eyeSlashDis: 'inline-block', 
        eyeDis: 'none',
        eyeSlashDisRe: 'inline-block', 
        eyeDisRe: 'none'
    });

    async function createUser() {
        setIsLoading(true);
    
        await axios.post(`${status === 'seller' ? '/seller/createverification' : '/user/createverification'}`, {
            password: password,
            email: email
        }).then(() => {
            window.location.replace(`${FONTEND_URL}/checkemail?event=verification&email=${email}`);
        })
        .catch((err) => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function createAdmin() {
        setIsLoading(true);
       
        await axios.post(`/admin/verificationadmin`, {
            username: username,
            email: email,
            password: password
        })
        .then(() => {
            window.location.replace(`${FONTEND_URL}/checkemail?event=verification&email=${email}`);
        })
        .catch((err) => {
            handleErr(err)
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    function submit() {
        if(registerValidate(email, username, password, rePassword, status)) {    
            setErrMsg({...registerValidate(email, username, password, rePassword, status)});
            return ;
        }  
        
        setErrMsg({...registerValidate(email, username, password, rePassword, status)});

        if(status === 'admin') {
            createAdmin();
        } else {
            createUser();
        }
        
    }

    useEffect(() => {
        document.title = 'User Register'
        if(window.location.pathname.includes('admin')) {
            document.title = 'Create Admin' ;
        } else if(window.location.pathname.includes('seller')) {
            document.title = 'Seller Register' ;
        } else  {
            document.title = 'User Register' ;
        }
    },[])


    return (
        <div>
            <div className='registerPage'>
                <div className='registerBox'>
                    <div className='input-cover'>
                        <input 
                            name='email' 
                            type={'text'} 
                            placeholder='Email address' 
                            value={email || ''} 
                            style={{borderColor: `${errMsg?.email? 'red' : '' }`}}
                            onChange = {(e) => setEmail(e.target.value)}
                        />
                        {errMsg?.email && <span className='errMessage'>{errMsg?.email}</span>}
                    </div>
                    
                    {status === 'admin' && 
                     <div className='input-cover'>
                        <input 
                            name='username' 
                            type={'text'} 
                            value = {username} 
                            style={{borderColor: `${errMsg?.username? 'red' : '' }`}}
                            placeholder='Username' 
                            onChange = {(e) => setUsername(e.target.value)}
                        />
                        {errMsg?.username && <span className='errMessage'>{errMsg?.username}</span>}
                    </div>
                    }
                   
                    
                    <div className='inputPassword' style={{borderColor: `${errMsg?.password? 'red' : '' }`}}>
                        <input 
                            name='password' 
                            type={inputPassword.type} 
                            placeholder='Password' 
                            value={password || ''} 
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                        {errMsg?.password && <span className='errMessage'>{errMsg?.password}</span>}
                        
                        <button style={{display: inputPassword.eyeSlashDis}} onClick = {() => setInputPassword((prev) => {return{...prev,type: 'text', eyeDis: 'inline-block', eyeSlashDis: 'none'}})}><FontAwesomeIcon icon={faEyeSlash} /></button>
                        <button style={{display: inputPassword.eyeDis}} onClick = {() => setInputPassword((prev) => {return{...prev,type: 'password', eyeDis: 'none', eyeSlashDis: 'inline-block'}})}><FontAwesomeIcon icon={faEye} /></button>
                    </div>
                    
                    <div className='inputPassword' style={{borderColor: `${errMsg?.confirmPassword? 'red' : '' }`}}>
                        <input 
                            name='confirmPassword' 
                            type={inputPassword.typeRe} 
                            placeholder='Confirm password' 
                            value={rePassword || ''} 
                            onChange = {(e) => setRePassword(e.target.value)}
                        />
                        {errMsg?.confirmPassword && <span className='errMessage'>{errMsg?.confirmPassword}</span>}
                        
                        <button style={{display: inputPassword.eyeSlashDisRe}} onClick = {() => setInputPassword((prev) => {return{...prev,typeRe: 'text', eyeDisRe: 'inline-block', eyeSlashDisRe: 'none'}})}><FontAwesomeIcon icon={faEyeSlash} /></button>
                        <button style={{display: inputPassword.eyeDisRe}} onClick = {() => setInputPassword((prev) => {return{...prev,typeRe: 'password', eyeDisRe: 'none', eyeSlashDisRe: 'inline-block'}})}><FontAwesomeIcon icon={faEye} /></button>
                    </div>
                    
                    <div className='registerButtonBox'>
                        <button className='registerPageButton' onClick={() => submit()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;