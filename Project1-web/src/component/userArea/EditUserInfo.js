
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCheck, faUser, faPhone, faLocationDot, faEnvelope, faBank } from '@fortawesome/free-solid-svg-icons';
import '../../CSS-file/component-css/user-setting.css';
import { useContext, useEffect, useState } from "react";
import axios from '../../config/Axios';
import { API_URL, DEFAULT_AVATAR, FONTEND_URL } from '../../env';
import { handleErr } from '../../handle-err/HandleErr';
import { loadingContext } from '../../context/LoadingContextProvider';


function EditUserInfo({ userData }) {    
    const [userPic, setUserPic] = useState();
    const [userPicFile, setUserPicFile] = useState();
    const [profileName, setProfileName] = useState();
    const [receiveName, setReceiveName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [address, setAddress] = useState();
    const [email, setEmail] = useState();
    const [bankName, setBankName] = useState();
    const [bankAccountNumber, setBankAccountNumber] = useState();

    
    const [isEdit, setIsEdit] = useState(false);

    const { setIsLoading } = useContext(loadingContext);
   



    function onImgChange(e) {
        if(e.target.files && e.target.files.length > 0) {
           setUserPic(URL.createObjectURL(e.target.files[0]));
           setUserPicFile(e.target.files[0]);
        }    
    }

    function validateOk(){
        if(profileName === userData.profileName && 
            receiveName === userData.receiveName && 
            phoneNumber === userData.phoneNumber &&
            address === userData.address &&
            email === userData.email &&
            bankName === userData.bankName &&
            bankAccountNumber === userData.bankAccountNumber &&
            !userPicFile
        ) {
            return false;
        } else {
            return true;  
        }
    }

    async function userUpdateData() {
        setIsLoading(true);

        let formData = new FormData();
        const input = JSON.stringify({
            profileName: profileName,
            phoneNumber: phoneNumber,
            receiveName: receiveName,
            address: address,
            bankName: bankName,
            bankAccountNumber: bankAccountNumber
        })
        formData.append('userPicFile', userPicFile);
        formData.append('input', input);


        await axios.patch(`/user/updatedata`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(() => {
            window.location.replace(`${FONTEND_URL}/profile/myprofile`);
        })
        .catch(err => {
            handleErr(err);
            setIsEdit(false);
            setProfileName(userData.profileName);
            setPhoneNumber(userData.phoneNumber);
            setBankAccountNumber(userData.bankAccountNumber);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        document.title = 'Profile Setting';
    }, [])

    useEffect(() => {
        if(userData) {
            setUserPic(userData.profilePicture? `${API_URL}/userprofilepic/${userData.profilePicture}` : DEFAULT_AVATAR)
            setProfileName(userData.profileName);
            setReceiveName(userData.receiveName);
            setPhoneNumber(userData.phoneNumber);
            setAddress(userData.address);
            setEmail(userData.email);
            setBankName(userData.bankName);
            setBankAccountNumber(userData.bankAccountNumber);
        }
    }, [userData]);

    useEffect(() => {
        
    }, [profileName, receiveName, phoneNumber, address, address, email, bankName, bankAccountNumber, userPicFile, userData])


    if(userData) {
        return(
            <div className="editInfoPage">
                <div className="infoCard">
                    <div className='userProfilePic'>
                        <input className="inputImage" style={{display: 'none'}} type='file' accept="image/*" onChange = {(e) => onImgChange(e)}/>
                        <button className="editImageButton" style={{pointerEvents: `${isEdit? '' : 'none'}`}} onClick = {() => document.getElementsByClassName('inputImage')[0].click()}><FontAwesomeIcon icon={faPenToSquare} /></button>
                        <img className="infoPic" src={userPic} alt = 'user'/>
                    </div>
                    <div className="infoBox">
                        <div className="userNameBox">
                            <input className="userNameInput" disabled = {!isEdit} value={profileName || ''} onChange = {(e) => setProfileName(e.target.value)}/>
                        </div>
                        <div className="receiveNameBox">
                            <div className="infoHeader"><FontAwesomeIcon icon={faUser}/> Receive Name :</div>
                            <input className="receiveNameInput" disabled = {!isEdit} value={receiveName || ''} onChange = {(e) => setReceiveName(e.target.value)}/>
                        </div>
                        <div className="userEmailBox">
                            <div className="infoHeader"><FontAwesomeIcon icon={faEnvelope}/> Email :</div>
                            <input className="userEmailInput" disabled = {true} value={email || ''}/>
                        </div>
                        <div className="phoneNumberBox">
                            <div className="infoHeader"><FontAwesomeIcon icon={faPhone}/> Phone Number :</div>
                            <input className="phoneNumberInput" disabled = {!isEdit} value={phoneNumber || ''} onChange = {(e) => setPhoneNumber(e.target.value)}/>
                        </div>
                        <div className="addressBox">
                            <div className="infoHeader"><FontAwesomeIcon icon={faLocationDot}/> Address :</div>
                            <textarea className="addressInput" disabled = {!isEdit} value={address || ''} onChange = {(e) => setAddress(e.target.value)}/>
                        </div>
                        <div className="bankAccountBox">
                                <div className="infoHeader"><FontAwesomeIcon icon={faBank}/> Bank account :</div>
                                <input className="bankAccountInput" disabled = {!isEdit} value={bankAccountNumber || ''} onChange = {(e) => setBankAccountNumber(e.target.value)}/>
                                <select name='bankName' className='bankName' disabled = {!isEdit} value={bankName || ''} onChange = {(e) => setBankName(e.target.value)}>
                                    <option value='Bank1'>Bank1</option>
                                    <option value='Bank2'>Bank2</option>
                                    <option value='Bank3'>Bank3</option>
                                    <option value='Bank4'>Bank4</option>
                                </select>
                            </div>
                    </div>
                    <div className="editButton">
                        {!isEdit &&
                        <button onClick = {() => {
                            setIsEdit(true)
                        }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                        }
                        {isEdit &&
                        <button disabled = {!profileName?.replaceAll(' ','') } onClick = {() => {
                            setIsEdit(false)
                            if(validateOk()) {
                                userUpdateData();
                            }
                        }}><FontAwesomeIcon icon={faCheck} /></button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default EditUserInfo