
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCartShopping, faArrowRightToBracket, faUserPlus, faStore, faKey, faEraser } from '@fortawesome/free-solid-svg-icons';
import '../CSS-file/component-css/panel-dropdown.css';
import { useContext } from 'react';
import localStorage from '../tokenCheck/localStorage';
import axios from '../config/Axios';
import { API_URL, DEFAULT_AVATAR, FONTEND_URL } from '../env';
import { authContext } from '../context/AuthContextProvider';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';



function UserPanel() {
    const { authUser, status } = useContext(authContext )

    const { setIsLoading } = useContext(loadingContext);


    async function adminResetPassword() {
        setIsLoading(true);

        await axios.post(`/admin/admincreatereset`)
        .then(() => {
            localStorage.removeToken();
            window.location.replace(`${FONTEND_URL}/checkemail?event=resetpassword`);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function userResetPassword() {
        setIsLoading(true);

        await axios.post(`/user/usercreatereset`)
        .then(() => {
            localStorage.removeToken();
            window.location.replace(`${FONTEND_URL}/checkemail?event=resetpassword`);
        })
        .catch(err => {
            handleErr(err)
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function sellerResetPassword() {
        setIsLoading(true);

        await axios.post(`/seller/sellercreatereset`)
        .then(() => {
            localStorage.removeToken();
            window.location.replace(`${FONTEND_URL}/checkemail?event=resetpassword`);
        })
        .catch(err => {
            handleErr(err)
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function deleteAdmin() {
        setIsLoading(true);

        await axios.delete(`/admin/deleteadmin`)
        .then(() => {
            localStorage.removeToken();
            window.location.replace(`${FONTEND_URL}/admin`);
        })
        .catch(err => {
            handleErr(err)
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    async function logOut() {
        localStorage.removeToken();
        window.location.replace(`${FONTEND_URL}/home`);
    }

    if(status === 'guest') {
        return (
            <div>
                <div className='userIconBox'>
                    <img src={DEFAULT_AVATAR} alt={'Profile pic'}/>
                </div>
                <div className='userPanelMessage'>
                    <h3>You are not logged in</h3>
                </div>
                <ul className='userPanelList'>
                    <li onClick={() => window.location.href = `${FONTEND_URL}/login`}><FontAwesomeIcon icon={faArrowRightToBracket} /> &nbsp;Login</li>
                    <li onClick={() => window.location.href = `${FONTEND_URL}/Register`}><FontAwesomeIcon icon={faUserPlus} /> Register</li>
                </ul>
            </div>
        )
    } else if(status === 'user') {
        return (
            <div>
                <div className='userIconBox'>
                    <img src={authUser?.profilePicture ? `${API_URL}/userprofilepic/${authUser?.profilePicture}` : DEFAULT_AVATAR } alt={'Profile pic'}/>
                </div>
                <div className='userPanelMessage'>
                    <h3>Hi, {authUser?.profileName?.length > 10 ? authUser?.profileName.slice(0, 9) + '...' : authUser?.profileName} </h3>
                </div>
                <ul className='userPanelList'>
                    <li onClick={() => window.location.href = `${FONTEND_URL}/profile/myprofile`}><FontAwesomeIcon icon={faChartLine} /> My profile</li>
                    <li onClick={() => window.location.href = `${FONTEND_URL}/profile/mycart`}><FontAwesomeIcon icon={faCartShopping} /> My Cart</li>
                    <li onClick={() => userResetPassword()}><FontAwesomeIcon icon={faKey} /> Reset Password</li>
                </ul>
                <span style={{borderTop: '1px solid black', display: 'inline-block', width: '100%', margin: '5px'}}></span>
                <div className='userPanelMessage'>
                    <li onClick={() => logOut()}>Logout</li>
                </div>
            </div>
        )
    } else if(status === 'seller') {
        return (
            <div>
                <div className='userIconBox'>
                    <img src={authUser?.storePicture ? `${API_URL}/sellerprofilepic/${authUser?.storePicture}` : DEFAULT_AVATAR } alt={'Profile pic'}/>
                </div>
                <div className='userPanelMessage'>
                <h3>Hi, {authUser?.storeName?.length > 10 ? authUser?.storeName.slice(0, 9) + '...' : authUser?.storeName} </h3>
                </div>
                <ul className='userPanelList'>
                    <li onClick={() => window.location.href = `${FONTEND_URL}/profile/dashboard`}><FontAwesomeIcon icon={faChartLine} /> Dashboard</li>
                    <li onClick={() => window.location.href = `${FONTEND_URL}/mystore`}><FontAwesomeIcon icon={faStore} /> My Store</li>
                    <li onClick={() => sellerResetPassword()}><FontAwesomeIcon icon={faKey} /> Reset Password</li>
                </ul>
                <span style={{borderTop: '1px solid black', display: 'inline-block', width: '100%', margin: '5px'}}></span>
                <div className='userPanelMessage'>
                    <li onClick={() => logOut()}>Logout</li>
                </div>
            </div>
        );
    } else if(status === 'admin') {
        return (
            <div>
                <div className='userIconBox'>
                    <img src={DEFAULT_AVATAR} alt={'Profile pic'}/>
                </div>
                <div className='userPanelMessage'>
                <h3>Hi, {authUser?.username?.length > 10 ? authUser?.username.slice(0, 9) + '...' : authUser?.username} </h3>
                </div>
                <ul className='userPanelList'>
                    <li onClick={() => adminResetPassword()}><FontAwesomeIcon icon={faKey} /> Reset Password</li>
                    <li onClick={() => deleteAdmin()}><FontAwesomeIcon icon={faEraser} /> Delete Account</li>
                </ul>
                <span style={{borderTop: '1px solid black', display: 'inline-block', width: '100%', margin: '5px'}}></span>
                <div className='userPanelMessage'>
                    <li onClick={() => logOut()}>Logout</li>
                </div>
            </div>
        )
    }; 
};

export default UserPanel
