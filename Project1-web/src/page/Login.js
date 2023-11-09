import '../CSS-file/page-css/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import {useContext, useEffect, useState} from 'react';
import axios from '../config/Axios';
import localStorage from '../tokenCheck/localStorage';
import { FONTEND_URL } from '../env';
import { loginValidate } from '../validator/Validator';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';

function Login() {   
   const status = (window.location.pathname.includes('seller')? 'seller' : window.location.pathname.includes('admin')? 'admin' : 'user') 
   const [username, setUsername] = useState();
   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const [errMsg, setErrMsg] = useState();

   const [inputPassword, setInputPassword] = useState({type: 'password', eyeSlashDis: 'inline-block', eyeDis: 'none'});

   const { setIsLoading } = useContext(loadingContext);

    async function userLogin() {
        setIsLoading(true);
        await axios.post(`${status === 'user' ? '/user/login' : '/seller/login'}`, {
            email: email,
            password: password
        }).then((res) => {
            localStorage.setToken(res.data.token, res.data.status);
            window.location.reload();
        })
        .catch((err) => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function adminLogin() {
        setIsLoading(true);

        await axios.post(`/admin/login`, {username: username, password: password})
        .then(res => {
            localStorage.setToken(res.data.token, res.data.status);
            window.location.replace(`${FONTEND_URL}/index`);
        }).catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    
    function submit() {
        if(loginValidate(email, username, password, status)) {
            setErrMsg({...loginValidate(email, username, password, status)});
            return;
        }

        setErrMsg(loginValidate(email, username, password, status));
        
        if(status === 'admin') {
            adminLogin();
        } else {
            userLogin();
        }
    }


   useEffect(() => {
    if(status === 'seller') {
        document.title = 'Seller Login' 
    } else if(status === 'admin') {
        document.title = 'Admin Login'
    } else {
        document.title = 'Login'
    }
    // eslint-disable-next-line
},[]);


    return (
        <div>
            <div className='loginPage'>
                <div className='loginBox'>
                    
                    {status !== 'admin' && 
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
                    }

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
                    
                    {status === 'user' && <div className='forgottenLink' onClick={() => window.location.href = `${FONTEND_URL}/forgotten`}>Forgotten Password</div>}
                    {status === 'seller' && <div className='forgottenLink' onClick={() => window.location.href = `${FONTEND_URL}/seller/forgotten`}>Forgotten Password</div>}
                    {status === 'admin' && <div className='forgottenLink' onClick={() => window.location.href = `${FONTEND_URL}/admin/forgotten`}>Forgotten Password</div>}
                    
                    <div className='buttonBox'>
                        <button className='loginButton' onClick={() => submit()}>Login</button>
                        {status === 'user' && <button className='registerButton' onClick={() => window.location.href =`${FONTEND_URL}/register`}>Create new account</button>}
                        {status === 'seller' && <button className='registerButton' onClick={() => window.location.href =`${FONTEND_URL}/seller/register`}>Create new store</button>}
                        {status === 'admin' && <button className='registerButton' onClick={() => window.location.href = `${FONTEND_URL}/admin/register`}>Create Admin</button>}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login;