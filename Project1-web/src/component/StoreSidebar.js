import '../CSS-file/component-css/shop-sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircleCheck, faBoxesStacked, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import axios from '../config/Axios';
import { API_URL, DEFAULT_AVATAR, FONTEND_URL } from '../env';
import { authContext } from '../context/AuthContextProvider';
import StoreDropdown from './StoreDropdown';
import { handleErr } from '../handle-err/HandleErr';






function StoreSidebar({ shopData, productData, searchParams, sentData }) {
    const { status, authUser } = useContext(authContext);
    const [productTypeList, setProductTypeList] = useState();
    const [activeButton, setActiveButton] = useState();
    const [defaultActiveButton, setDefaultActiveButton] = useState();
    const [isLiked, setIsLiked] = useState(false);
    const [open, setOpen] = useState(false);
 


    async function likeStore() {
        await axios.post(`/favorite/createfavorite`, {
            sellerId: shopData.id
        })
        .then(() => {
            setIsLiked(true);
        })
        .catch(err => {
            handleErr(err);
        });
    }

    async function unLikeStore() {
            await axios.delete(`/favorite/deletefavorite/${shopData.id}`)
            .then(() => {
               setIsLiked(false)
            })
            .catch(err => {
               handleErr(err)
            });
    }

    //SearchParams----------------------------------------------
    const [typeParams,setTypeParams] = useState({type: 'all'});
    
    useEffect(() => {
        let type = searchParams.get('type')
        if(type === 'all') {
            setActiveButton({...defaultActiveButton});
        } else {
            setActiveButton({...defaultActiveButton, [type]: true});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchParams]);


    function enterLikeButton() {
        if(status === 'guest') {
            window.location.href = `${FONTEND_URL}/login` ;
        } else if(status === 'user') {
            likeStore();
        } else {
            window.location.href = `${FONTEND_URL}/index` ;
        }
    }


    useEffect(() => {
        if(authUser && shopData && status === 'user') {
            const favorite = [...authUser.favorites]
            if(favorite.find(e => e.sellerId === shopData.id)) {
                setIsLiked(true);
            } else {
                setIsLiked(false)
            }
        }
    }, [authUser, shopData, status])

    useEffect(() => {

        if(productData) {
            let typeArr = [];
            let preActiveButton = {};
            
            productData.forEach(e => {
                if(!typeArr.filter(i => i === e.productType)[0]) {
                    typeArr.push(e.productType);
                    preActiveButton[e.productType] = false;
                };  
            });
            
            setActiveButton({...preActiveButton});
            setDefaultActiveButton({...preActiveButton});
            setProductTypeList([...typeArr]);
        }
    }, [productData, shopData])


    useEffect(() => {
        sentData(typeParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeParams])


    return (
        <div className="storeSideBar">
            <div className='storeProfile'>
                
                {status !== 'seller' &&
                <div className='storeFavorButton'>
                    {!isLiked && <div onClick = {enterLikeButton} ><FontAwesomeIcon icon={faHeart} style={{color: "#b7b9bd"}} /></div>}
                    {isLiked && <div onClick = {unLikeStore} ><FontAwesomeIcon icon={faHeart} style={{color: "#00bfff"}} /></div>}
                </div>
                }

                <img className='storeProfilePic' src = {shopData?.storePicture? `${API_URL}/sellerprofilepic/${shopData?.storePicture}` : DEFAULT_AVATAR} alt='store'/>
                
                <div className='storeNameBox'>
                    <div className='storeName'>{shopData?.storeName?.length > 10 ? shopData?.storeName?.slice(0, 9) + '...' : shopData?.storeName}</div>
                    {!open && <div className='setStoreDetailButton' onClick={() => setOpen(true)}><FontAwesomeIcon icon={faChevronRight} /></div>}
                    {open && <div className='setStoreDetailButton'  onClick={() => setOpen(false)}><FontAwesomeIcon icon={faChevronLeft} /></div>}
                </div>

                <div className='storeSellCount'> <FontAwesomeIcon icon={faCircleCheck} style={{color: "yellowgreen"}}/>&nbsp;{shopData?.totalSellCount}</div>
                
                <div className='storeWelcomeMessege'>{shopData?.welcomeMessage?.length > 53 ? shopData.welcomeMessage.slice(0,52) + '...' : shopData?.welcomeMessage}</div>
            </div>
            
            {open && <StoreDropdown shopData = {shopData} setOpen = {setOpen}/>}
            
            <div className='categoryBox'>
                <div className='storeCategory'><FontAwesomeIcon icon={faBoxesStacked} /> Category</div>
                <ul className='storeTypeList'>
                    {productTypeList?.map(e => 
                        <div key={e} className='storeTypeButtonBox'>
                            {!activeButton[e] &&
                            <li className='storeTypeButton' onClick={() => {
                                setActiveButton({...defaultActiveButton, [e]: true});
                                setTypeParams({...typeParams, type: e});
                            }}>{e}</li>
                            }

                            {activeButton[e] &&
                            <li className='storeTypeActiveButton' onClick={() => {
                                setActiveButton({...defaultActiveButton});
                                setTypeParams({...typeParams, type: 'all'});   
                            }}>{e}</li>
                            }
                        </div>
                    )}
                </ul>
            </div>
        </div>
    )    
}

export default StoreSidebar