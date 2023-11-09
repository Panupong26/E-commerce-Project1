import { useParams } from "react-router-dom"
import ProductCard from "../component/ProductCard";
import StoreSidebar from "../component/StoreSidebar";
import '../CSS-file/page-css/shop.css';
import {useContext, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import axios from '../config/Axios';
import NavBar from "../component/NavBar";
import { authContext } from "../context/AuthContextProvider";
import { handleErr } from "../handle-err/HandleErr";




function Shop(props) {
    const { status, authUser } = useContext(authContext);
    const {shopName} = useParams();
    const [shopData, setShopData] = useState();
    const [allTypeProductData, setAllTypeProductData] = useState();
    const [productData,setProductData] = useState();
   
    

    // Type Filter
    const [searchParams, setSearchParams] = useSearchParams({type: 'all'});
    const [searchQuery, setSearchQuery] = useState('')
    
    function sentData(data) {
        if(searchParams.get('query')){
            setSearchParams({type: data.type, query: searchParams.get('query') });
        } else {
            setSearchParams({type: data.type});
        }
    }


    useEffect(() => {
        async function getShopData() {
            await axios.post(`/seller/getshopdatabyname`, {shopName: shopName})
            .then(res => {
                setShopData({...res.data});
            })
            .catch(err => {
               handleErr(err);
            })
        }

        if(status !== 'seller') {
            getShopData();
        }
       // eslint-disable-next-line
    }, []);

    
    useEffect(() => {
        if(status === 'seller') {
            setShopData({...authUser});
        }
    }, [authUser, status]);
    
    
    useEffect(() => {
        async function getAllProductData() {
            await axios.post(`/product/getproductbysellerid`, {sellerId: shopData.id})
            .then(res => {
                setAllTypeProductData([...res.data]);
                setProductData([...res.data]);
            })
            .catch(err => {
                handleErr(err)
            })
        }


        if(shopData && shopData.id) {
            document.title = shopData.storeName;
            getAllProductData(); 
        }
    },[shopData])

    
    useEffect(() => {
        if(allTypeProductData) {
            let type = searchParams.get('type')
            let query = searchParams.get('query')
            if(type === 'all') {
                setProductData(allTypeProductData);
                if(query) {
                    let productFilter = allTypeProductData.filter(e => (e.productType.toUpperCase().includes(query.toUpperCase()) || e.productName.toUpperCase().includes(query.toUpperCase()) || e.productDetail.toUpperCase().includes(query.toUpperCase())));
                    setProductData(productFilter);
                }
            } else {
                let newProductData = allTypeProductData.filter(e => e.productType === type);
                setProductData(newProductData);
                if(query) {
                    let productFilter = newProductData.filter(e => (e.productType.toUpperCase().includes(query.toUpperCase()) || e.productName.toUpperCase().includes(query.toUpperCase()) || e.productDetail.toUpperCase().includes(query.toUpperCase())));
                    setProductData(productFilter);
                }
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchParams, allTypeProductData])

    useEffect(() => {
        if(searchQuery === '') {
            setSearchParams({type: searchParams.get('type')});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchQuery])


    return <>
        <div>
            <NavBar 
                searchQuery = {searchQuery}
                setSearchQuery = {setSearchQuery}
                searchParams = {searchParams}
                setSearchParams = {setSearchParams}
            />
            <div className='shopPage'>
                <StoreSidebar productData = {allTypeProductData} shopData = {shopData} sentData = {sentData} searchParams={searchParams} userData = {authUser}  status = {props.status}/>
                <div className="shopContent">
                    {productData?.map(el => <div key={el.id}><ProductCard data = {el}/></div>)}
                </div>
            </div>
        </div>
    </>
    
}

export default Shop