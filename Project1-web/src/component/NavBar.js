import { useContext, useState } from "react";
import { authContext } from "../context/AuthContextProvider";
import { FONTEND_URL } from "../env";
import AlertBox from "./AlertBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faStore, faXmark, faArrowUpWideShort, faPlus, faBell, faCartShopping, faSliders, faMagnifyingGlass, faUser } from "@fortawesome/free-solid-svg-icons";
import UserPanel from "./UserPanel";
import HomeFilter from "../component/HomeFilter";
import "../CSS-file/component-css/nav-bar.css"

export default function NavBar(props) {
    const { status, notification, cartData } = useContext(authContext);
    const [open, setOpen] = useState({
        homeFilter: false,
        sortMenu: false,
        alertBox: false,
        userPanel: false
    })

    const changeHomeSearchParams = () => {
        props.setSearchParams(() => {
            if(props.searchQuery) {
                if(props.filterParams) {
                    props.setSideBarParams({type: undefined});
                    return {type: props.filterParams, query: props.searchQuery, min: props.priceFilterParams.min, max: props.priceFilterParams.max}
                } else {
                    if(props.sideBarParams) {
                        return {type: props.sideBarParams.type, query: props.searchQuery, min: props.priceFilterParams.min, max: props.priceFilterParams.max}
                    } else {
                        return {query: props.searchQuery, min: props.priceFilterParams.min, max: props.priceFilterParams.max}
                    }
                }
            } else {
                if(props.filterParams) {
                    props.setSideBarParams({type: undefined});
                    return {type: props.filterParams, min: props.priceFilterParams.min, max: props.priceFilterParams.max}
                } else {
                    if(props.sideBarParams) {
                        return {type: props.sideBarParams.type, min: props.priceFilterParams.min, max: props.priceFilterParams.max}
                    } else {
                        return {min: props.priceFilterParams.min, max: props.priceFilterParams.max}
                    }
                }
            }
        })
    }


    return <>
        <div className="navbar">
            <div className='navList'>
                {(status === 'guest' || status === 'user') && <div className='pageLink' onClick={() => window.location.href = FONTEND_URL}><FontAwesomeIcon icon={faHouse} /></div>}
                {status === 'admin' && <div className='pageLink' onClick={() => window.location.href = `${FONTEND_URL}/index`}><FontAwesomeIcon icon={faHouse} /></div> }
                {status === 'guest' && <div className='pageLink storePageLink' onClick={() => window.location.href = `${FONTEND_URL}/seller`}><FontAwesomeIcon icon={faStore} /> Seller</div>}
                {status === 'seller' && <div className='pageLink storePageLink' onClick={() => window.location.href = `${FONTEND_URL}/mystore`}><FontAwesomeIcon icon={faStore} /> My store</div>}
            </div >

            
            <div className='navList centerNavList'>
                {window.location.pathname.split('/')[1] === 'home' &&
                <div className='searchBox'>    
                    <input placeholder='Search here' value={props.searchQuery} onChange={(e) => props.setSearchQuery(e.target.value)}></input>
                    <button onClick={() => {props.setSearchQuery('') ; props.setSearchParams(() => (props.searchParams.get('type'))? {type: props.searchParams.get('type')} : '')}}><FontAwesomeIcon icon={faXmark} /></button>
                    <div className='filter' onClick={() => setOpen({...open, homeFilter: true})}>
                        <FontAwesomeIcon icon={faSliders} />
                    </div>
                    <button onClick={changeHomeSearchParams}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                    <button className='productSortButton' onClick={() => setOpen({...open, sortMenu: true})}><FontAwesomeIcon icon={faArrowUpWideShort} /></button>
                </div>
                }
               
                {(window.location.pathname.split('/')[1] === 'shop' || window.location.pathname.split('/')[1] === 'mystore') &&
                <div className='searchBox'>    
                    <input type='text' onChange={(e) => props.setSearchQuery(e.target.value)} value={props.searchQuery} placeholder='Search here'></input>
                    <button onClick={() => props.setSearchQuery('')}><FontAwesomeIcon icon={faXmark} /></button>
                    <button onClick={() => props.setSearchParams(() => {return (props.searchQuery !== '')? {type: props.searchParams.get('type'), query: props.searchQuery} : {type: props.searchParams.get('type')}})}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                </div>
                }
            </div>

            <div className='navList'>
                {status === 'seller' && <div className='pageLink' onClick={() => window.location.href = `${FONTEND_URL}/addproduct`}><FontAwesomeIcon icon={faPlus} /></div>}
                
                {(status === 'user' || status === 'seller') &&
                    <div className='pageLink' onClick={() => {
                        if(notification?.length > 0) {
                            setOpen({...open, alertBox: true})
                        }
                    }}>
                        <FontAwesomeIcon icon={faBell} />
                        {notification?.length > 0 && <div className='navbarAlert'>{notification?.length}</div>}
                    </div>    
                }
                
                
                {open.alertBox && (status === 'user' || status === 'seller') && 
                    <div><AlertBox setOpen = {setOpen} open = {open} notification = {notification}/></div>
                }
            
               
               {status === 'user' &&
                <div className='pageLink myCart' onClick={() => window.location.href = `${FONTEND_URL}/profile/mycart`}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    {cartData?.length > 0 && <div className='navbarAlert'>{cartData?.length}</div>}  
                </div>
                }
                
                
                <div className='pageLink user' onClick={() => setOpen({...open, userPanel: true})}><FontAwesomeIcon icon={faUser} /></div>
                
                
                {open?.userPanel &&
                <div className='userPanel' onMouseLeave={() => setOpen({...open, userPanel: false})}>
                    <UserPanel/>
                </div>
                } 
            </div>


            {open?.homeFilter &&
            <div className='filterBox' onMouseLeave={() => {
                changeHomeSearchParams();
                setOpen({...open, homeFilter: false});
            }}>
                <HomeFilter productData = {props.allProductType} sentFilterParams = {props.getParams} searchParams = {props.searchParams} sentPrice = {props.getPrice} setSearchParams = {props.setSearchParams}/>    
            </div>}


            {open.sortMenu &&
            <div className='productSortMenuBox' onMouseLeave={() => setOpen({...open, sortMenu: false})} >
                    <div onClick={() => props.setSort('Latest')}>Latest</div>
                    <div onClick={() => props.setSort('Price')}>Price</div>
                    <div onClick={() => props.setSort('Total Sold')}>Total Sold</div>
                    <div onClick={() => props.setSort('Star')}>Star</div>
            </div>
            }
        </div>
    </>
}