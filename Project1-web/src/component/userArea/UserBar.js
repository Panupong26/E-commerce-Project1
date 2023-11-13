import { useContext, useState, useEffect } from "react";
import { authContext } from "../../context/AuthContextProvider";
import "../../CSS-file/component-css/user-bar.css"
import Orders from "../Orders";
import Cart from "./Cart";
import EditUserInfo from "./EditUserInfo";
import FavoriteShop from "./FavoriteShop";
import { FONTEND_URL } from "../../env";

const activeUserBarButtonDefault = {
    orders: '',
    favoriteShop: '',
    cart: '',
    editInfo: ''
};

export default function UserBar({ page, setUserAreaPage }) {
    const { authUser, cartData, setCartData } = useContext(authContext);
    const [activeUserBarButton, setActiveUserBarButton] = useState(activeUserBarButtonDefault)

    useEffect(() => {
        setActiveUserBarButton(prev => {return{...prev, editInfo: '0 8px 5px -5px yellowgreen'}});
        if(page && authUser && cartData) {
            switch(page) {
                case 'mycart' : 
                    setUserAreaPage(<Cart userData = {authUser} cartData = {cartData} setCartData = {setCartData}/>);
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, cart: '0 8px 5px -5px yellowgreen'}});
                    break;
                case 'myprofile' :
                    setUserAreaPage(<EditUserInfo userData = {authUser}/>)
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, editInfo: '0 8px 5px -5px yellowgreen'}});
                    break;
                case 'myorders' :
                    setUserAreaPage(<Orders />)
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, orders: '0 8px 5px -5px yellowgreen'}});
                    break;
                case 'myfavoriteshop' :
                    setUserAreaPage(<FavoriteShop userData = {authUser}/>)
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, favoriteShop: '0 8px 5px -5px yellowgreen'}});
                    break;
                default : 
                    setUserAreaPage(<EditUserInfo userData = {authUser}/>)
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, editInfo: '0 8px 5px -5px yellowgreen'}});
            }
        };
        // eslint-disable-next-line
    }, [page, authUser, cartData, setCartData]);


    return <>
     <div className='userBar'>
            <div 
                style={{boxShadow: activeUserBarButton.orders}} 
                onClick={() => {
                    window.history.pushState(null, 'My orders', `${FONTEND_URL}/profile/myorders` ); 
                    setUserAreaPage(<Orders />); 
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, orders: '0 8px 5px -5px yellowgreen'}})
                }}>Orders</div>
            
            <div 
                style={{boxShadow: activeUserBarButton.favoriteShop}} 
                onClick={() => {
                    window.history.pushState(null, 'Favorite shop', `${FONTEND_URL}/profile/myfavoriteshop` );
                    setUserAreaPage(<FavoriteShop userData = {authUser}/>); 
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, favoriteShop: '0 8px 5px -5px yellowgreen'}});
                }}>Favorite Shop</div>
            
            <div 
                style={{boxShadow: activeUserBarButton.cart}} 
                onClick={() => {
                    window.history.pushState(null, 'Cart', `${FONTEND_URL}/profile/mycart` ); 
                    setUserAreaPage(<Cart userData = {authUser} cartData = {cartData} setCartData = {setCartData}/>); 
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, cart: '0 8px 5px -5px yellowgreen'}});
                }}>Cart</div>
            
            <div 
                style={{boxShadow: activeUserBarButton.editInfo}} 
                onClick={() => {
                    window.history.pushState(null, 'User info', `${FONTEND_URL}/profile/myprofile` ); 
                    setUserAreaPage(<EditUserInfo userData = {authUser}/>); 
                    setActiveUserBarButton(activeUserBarButtonDefault); 
                    setActiveUserBarButton(prev => {return{...prev, editInfo: '0 8px 5px -5px yellowgreen'}});
                }}>Profile</div>
        </div>
    </>
}