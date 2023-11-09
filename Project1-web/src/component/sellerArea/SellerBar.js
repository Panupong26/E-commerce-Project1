import { useContext, useState, useEffect } from "react";
import { authContext } from "../../context/AuthContextProvider";
import { FONTEND_URL } from "../../env";
import Orders from "../Orders";
import ShopSetting from "./ShopSetting";
import ShopDashboard from "./ShopDashboard";
import ShopWithdraw from "./ShopWithdraw";


const activeSellerBarButtonDefault = {
    orders: '',
    shopSetting: '',
    dashboard: '',
    withdraw: '',
};

export default function SellerBar({ page, setUserAreaPage }) {
    const { authUser } = useContext(authContext);
    const [activeSellerBarButton, setActiveSellerBarButton] = useState(activeSellerBarButtonDefault)

    useEffect(() => {
        setActiveSellerBarButton(prev => {return{...prev, editInfo: '0 8px 5px -5px yellowgreen'}})
        if(page && authUser) {
            switch(page) {
                case 'myorders' : 
                    setUserAreaPage(<Orders sellerData = {authUser}/>);
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, cart: '0 8px 5px -5px yellowgreen'}});
                    break;
                case 'shopsetting' :
                    setUserAreaPage(<ShopSetting sellerData = {authUser}/>)
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, shopSetting: '0 8px 5px -5px yellowgreen'}});
                    break;
                case 'dashboard' :
                    setUserAreaPage(<ShopDashboard sellerData = {authUser}/>)
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, dashboard: '0 8px 5px -5px yellowgreen'}});
                    break;
                case 'withdraw' :
                    setUserAreaPage(<ShopWithdraw sellerData = {authUser}/>)
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, withdraw: '0 8px 5px -5px yellowgreen'}});
                    break;
                default : 
                    setUserAreaPage(<ShopDashboard sellerData = {authUser}/>)
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, editInfo: '0 8px 5px -5px yellowgreen'}});
            }
        }
    }, [authUser, setUserAreaPage, page])


    return <>
        <div className='sellerBar'>
            <div 
                style={{boxShadow: activeSellerBarButton.orders}} 
                onClick={() => {
                    window.history.pushState(null, 'My orders', `${FONTEND_URL}/profile/myorders` );
                    setUserAreaPage(<Orders />); 
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, orders: '0 8px 5px -5px yellowgreen'}})
                }}>Orders</div>
            <div 
                style={{boxShadow: activeSellerBarButton.shopSetting}} 
                onClick={() => {
                    window.history.pushState(null, 'Shop setting', `${FONTEND_URL}/profile/shopsetting` );
                    setUserAreaPage(<ShopSetting sellerData = {authUser}/>); 
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, shopSetting: '0 8px 5px -5px yellowgreen'}})
                }}>Shop Setting</div>
            <div 
                style={{boxShadow: activeSellerBarButton.dashboard}} 
                onClick={() => {
                    window.history.pushState(null, 'Dashboard', `${FONTEND_URL}/profile/dashboard` ); 
                    setUserAreaPage(<ShopDashboard sellerData = {authUser}/>); 
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, dashboard: '0 8px 5px -5px yellowgreen'}})
                }}>Dashboard</div>
            <div 
                style={{boxShadow: activeSellerBarButton.withdraw}} 
                onClick={() => {
                    window.history.pushState(null, 'Withdraw', `${FONTEND_URL}/profile/withdraw` ); 
                    setUserAreaPage(<ShopWithdraw sellerData = {authUser}/>); 
                    setActiveSellerBarButton(activeSellerBarButtonDefault)
                    setActiveSellerBarButton(prev => {return{...prev, withdraw: '0 8px 5px -5px yellowgreen'}})
                }}>Withdraw</div>
        </div>
    </>
}