
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCheck, faBullhorn, faPhone, faLocationDot, faEnvelope, faBank, faComment } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram} from '@fortawesome/free-brands-svg-icons';
import axios from "../../config/Axios";
import '../../CSS-file/component-css/seller-setting.css';
import { useContext, useEffect, useState } from "react";
import { API_URL, DEFAULT_AVATAR } from '../../env';
import { loadingContext } from '../../context/LoadingContextProvider';
import { handleErr } from '../../handle-err/HandleErr';

function ShopSetting(props) {
    const [sellerData, setSellerData] = useState();
    
    const [sellerPic,setSellerPic] = useState();
    const [sellerName,setSellerName] = useState();
    const [sellerPhoneNumber,setSellerPhoneNumber] = useState();
    const [sellerAddress,setSellerAddress] = useState();
    const [sellerEmail,setSellerEmail] = useState();
    const [sellerFacebook,setSellerFacebook] = useState();
    const [sellerInstagram,setSellerInstagram] = useState();
    const [sellerBank,setSellerBank] = useState();
    const [sellerBankAccount,setSellerBankAccount] = useState();
    const [sellerWelcomeMessage,setSellerWelcomeMessage] = useState();
    const [sellerShopDescription, setSellerShopDescription] = useState();


    //event
    const [isEdit, setIsEdit] = useState(false);

    const [file, setFile] = useState();

    const { setIsLoading } = useContext(loadingContext);


    function validateOk(){
        if( sellerName === sellerData.storeName && 
            sellerPhoneNumber === sellerData.phoneNumber &&
            sellerAddress === sellerData.address &&
            sellerEmail === sellerData.email &&
            sellerFacebook === sellerData.facebook &&
            sellerInstagram === sellerData.instagram &&
            sellerBank === sellerData.bankName &&
            sellerBankAccount === sellerData.bankAccountNumber &&
            sellerWelcomeMessage === sellerData.welcomeMessage &&
            sellerShopDescription === sellerData.storeDescription &&
            !file
        ) {
            return false;
        } else {
            return true;  
        }
    }

    function onImgChange(e) {
        if(e.target.files && e.target.files.length > 0) {
           setSellerPic(URL.createObjectURL(e.target.files[0]));
           setFile(e.target.files[0]);  
        }     
    }

    async function updateData() {
        setIsLoading(true);

        const input = { 
            storeName: sellerName,
            phoneNumber: sellerPhoneNumber,
            address: sellerAddress,
            email: sellerEmail,
            facebook: sellerFacebook,
            instagram: sellerInstagram,
            bankName: sellerBank,
            bankAccountNumber: sellerBankAccount,
            welcomeMessage: sellerWelcomeMessage,
            storeDescription:  sellerShopDescription,
        }

        const form = new FormData();
        form.append('storePicture', file);
        form.append('input', JSON.stringify(input));

        await axios.put('/seller/updatedata', form, {headers: {'Content-Type': 'multipart-formdata'}})
        .then(() => {
            window.location.reload();
        })
        .catch(err => {
            handleErr(err)
        })
        .finally(() => {
            setIsLoading(false);
        })
    };

    useEffect(() => {
        document.title = 'Store Setting';
    }, [])
    useEffect(() => {
        setSellerData(props.sellerData);
    }, [props.sellerData])

    useEffect(() => {
        if(sellerData) {
            setSellerPic(sellerData.storePicture);
            setSellerName(sellerData.storeName);
            setSellerPhoneNumber(sellerData.phoneNumber);
            setSellerAddress(sellerData.address);
            setSellerEmail(sellerData.email);
            setSellerFacebook(sellerData.facebook);
            setSellerInstagram(sellerData.instagram);
            setSellerBank(sellerData.bankName);
            setSellerBankAccount(sellerData.bankAccountNumber);
            setSellerWelcomeMessage(sellerData.welcomeMessage);
            setSellerShopDescription(sellerData.storeDescription);
        }
    }, [sellerData])


    if(sellerData) {
        return(
            <div className="sellerEditInfoPage">
                <div className="sellerInfoCard">
                    
                    <div className='sellerSettingBox'>
                        <input className="sellerInputImage" style={{display: 'none'}} type='file' accept="image/*" onChange = {(e) => onImgChange(e)}/>
                        <button className="sellerEditImageButton" style={{pointerEvents: isEdit? '' : 'none'}} disabled = {!isEdit} onClick = {() => document.getElementsByClassName('sellerInputImage')[0].click()}><FontAwesomeIcon icon={faPenToSquare} /></button>
                        <img className="sellerInfoPic" src={sellerPic? sellerPic?.includes('http://')? sellerPic : `${API_URL}/sellerprofilepic/${sellerPic}` : DEFAULT_AVATAR} alt = 'seller'/>
                    </div>
                    
                    <div className='sellerSettingBox'>
                        <div className="sellerNameBox">
                            <input className="sellerNameInput" disabled = {!isEdit} value={sellerName || ''} onChange = {(e) => setSellerName(e.target.value)}/>
                        </div>
                        <div className="sellerInfoBox">
                            <div className="sellerEmailBox">
                                <div className="sellerInfoHeader"><FontAwesomeIcon icon={faEnvelope}/> Email :</div>
                                <input className="sellerEmailInput" disabled = {true} value={sellerEmail || ''}/>
                            </div>
                            <div className="sellerPhoneNumberBox">
                                <div className="sellerInfoHeader"><FontAwesomeIcon icon={faPhone}/> Phone Number :</div>
                                <input className="sellerPhoneNumberInput" disabled = {!isEdit} value={sellerPhoneNumber || ''} onChange = {(e) => setSellerPhoneNumber(e.target.value)}/>
                            </div>
                            <div className="sellerAddressBox">
                                <div className="sellerInfoHeader"><FontAwesomeIcon icon={faLocationDot}/> Address :</div>
                                <textarea className="sellerAddressInput" disabled = {!isEdit} value={sellerAddress || ''} onChange = {(e) => setSellerAddress(e.target.value)}/>
                            </div>
                            <div className="sellerFacebookBox">
                                <div className="sellerInfoHeader"><FontAwesomeIcon icon={faFacebookF}/> Facebook :</div>
                                <input className="sellerFacebookInput" disabled = {!isEdit} value={sellerFacebook || ''} onChange = {(e) => setSellerFacebook(e.target.value)}/>
                            </div>
                            <div className="sellerInstagramBox">
                                <div className="sellerInfoHeader"><FontAwesomeIcon icon={faInstagram}/> Instagram :</div>
                                <input className="sellerInstagramInput" disabled = {!isEdit} value={sellerInstagram || ''} onChange = {(e) => setSellerInstagram(e.target.value)}/>
                            </div>
                            <div className="sellerBankAccountBox">
                                <div className="sellerInfoHeader"><FontAwesomeIcon icon={faBank}/> Bank account :</div>
                                <input className="sellerBankAccountInput" disabled = {!isEdit} value={sellerBankAccount || ''} onChange = {(e) => setSellerBankAccount(e.target.value)}/>
                                <select name='sellerBank' className='sellerBank' value={sellerBank || ''} disabled = {!isEdit} onChange = {(e) => setSellerBank(e.target.value)}>
                                    <option value='Bank1'>Bank1</option>
                                    <option value='Bank2'>Bank2</option>
                                    <option value='Bank3'>Bank3</option>
                                    <option value='Bank4'>Bank4</option>
                                </select>
                            </div>
                        </div>   
                    </div>

                    <div className='sellerSettingBox'>
                        <div className="sellerWelcomeMessageBox">
                            <div className="sellerInfoHeader"><FontAwesomeIcon icon={faComment}/> Welcome message</div>
                            <textarea className="sellerWelcomeMessageInput" disabled = {!isEdit} value={sellerWelcomeMessage || ''} onChange = {(e) => setSellerWelcomeMessage(e.target.value)}/>
                        </div>
                        <div className="sellerShopDescriptionBox">
                            <div className="sellerInfoHeader"><FontAwesomeIcon icon={faBullhorn} /> Shop description</div>
                            <textarea className="sellerShopDescriptionInput" disabled = {!isEdit} value={sellerShopDescription || ''} onChange = {(e) => setSellerShopDescription(e.target.value)}/>
                        </div>
                        <div className="sellerEditButton">
                            {!isEdit &&
                            <button className="editSellerButton" onClick = {() => {
                                setIsEdit(true);
                            }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                            }

                            {isEdit &&
                            <button className="editedSellerButton" disabled = {!(sellerName.replaceAll(' ',''))} 
                            onClick = {() => {
                                setIsEdit(false);
                                if(validateOk()) {
                                    updateData();
                                }
                            }}><FontAwesomeIcon icon={faCheck} /></button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShopSetting