
import '../CSS-file/page-css/profile.css';
import {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from '../config/Axios';
import localStorage from '../tokenCheck/localStorage';
import { authContext } from '../context/AuthContextProvider';
import { API_URL, DEFAULT_AVATAR, FONTEND_URL } from '../env';
import UserBar from '../component/userArea/UserBar';
import SellerBar from '../component/sellerArea/SellerBar';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';



function Profile() {
    let {page} = useParams();
    const { authUser, status } = useContext(authContext);
    const [userAreaPage, setUserAreaPage] = useState();
    const { setIsLoading } = useContext(loadingContext);


    async function deleteUser() {
        setIsLoading(true);
        
        await axios.delete(`/user/deleteuser`)
        .then(() => {
            localStorage.removeToken();
            window.location.replace(`${FONTEND_URL}`);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })

    };

    async function deleteSeller() {
        setIsLoading(true);

        await axios.delete(`/seller/deleteseller`)
        .then(() => {
            localStorage.removeToken();
            window.location.replace(`${FONTEND_URL}`);
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })

    };

    useEffect(() => {
        document.title = 'My Profile'
    }, []);
    
    return <>
        <div className = 'profilePage'>
            { status === 'user' &&
            <div className='sideInfo'>
                <img src={authUser?.profilePicture ? `${API_URL}/userprofilepic/${authUser?.profilePicture}` : DEFAULT_AVATAR } alt='User'/>
                <div className='userName'>{authUser?.profileName.length > 10 ? authUser?.profileName.slice(0, 9) + '...' : authUser?.profileName}</div>
                <button className='deleteAccountButton' onClick={() => deleteUser()}>Delete Account</button>
            </div>
            }
            { status === 'seller' &&
            <div className='sideInfo'>
                <img src={authUser?.storePicture ? `${API_URL}/sellerprofilepic/${authUser?.storePicture}` : DEFAULT_AVATAR } alt='User'/>
                <div className='userName'>{authUser?.storeName.length > 10 ? authUser?.storeName.slice(0, 9) + '...' : authUser?.storeName}</div>
                <button className='deleteAccountButton' onClick={() => deleteSeller()}>Delete Account</button>
            </div>
            }

            <div className='userArea'>
                {status === 'user' && <UserBar setUserAreaPage = {setUserAreaPage} page = {page}/>}
                {status === 'seller' && <SellerBar setUserAreaPage = {setUserAreaPage} page = {page}/>}
                <div className='userAreaContent'>
                    {userAreaPage}  
                </div>
            </div>
        </div>   
    </>
        
    
} 

export default Profile