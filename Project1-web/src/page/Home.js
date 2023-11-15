import '../CSS-file/page-css/home.css';
import ProductCard from '../component/ProductCard';
import {useEffect, useState} from 'react';
import HomeSidebar from '../component/HomeSidebar';
import { useSearchParams } from 'react-router-dom';
import axios from '../config/Axios';
import NavBar from '../component/NavBar';
import { handleErr } from '../handle-err/HandleErr';



function Home() {
 
   // Content
    const [productData,setProductData] = useState([]);
    const [allProductType, setAllProductType] = useState();


    //searchParams
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery,setSearchQuery] = useState(''); //value from search input
    const [filterParams,setFilterParams]  = useState(''); //value from filter box
    const [priceFilterParams,setPriceFilterParams] = useState({}); //min-max price value
    const [sideBarParams,setSideBarParams] = useState({}); //value from sidebar
    const [sort, setSort] = useState();

    // get value from sidebar and filter box 
    // --Multi type value from filter box is string 
    // --One type value from sidebar is object
    function getParams(data) {
       if(typeof data === 'string') {
        setFilterParams(data); //Prepare value for set searchParams when mouse leave from filter box
       } else {
            if(data.type === 'all') { //Immediately clear and set searchParams when click button on sidebar
                setSearchParams({type: '', query: searchParams.get('query'), min: searchParams.get('min'), max: searchParams.get('max')});
            } else {
                setSearchParams({type: data.type, query: searchParams.get('query'), min: searchParams.get('min'), max: searchParams.get('max')});
                setSideBarParams(data); // Prepare value for set searchParams when mouse leave from filter box without clicking any button
            }
       };
    };

    //Get min-max price value from filter box
    function getPrice(data) {
        setPriceFilterParams(data);
    };


    async function getAllProductData() {
        await axios.get(`/product/getallproduct`)
        .then(res => {
            setAllProductType([...res.data]);
            setProductData([...res.data]);
        }).catch(err => {
            handleErr(err);
        });
    };


    useEffect(() => {
        document.title = 'Home';
        getAllProductData();
    },[]);

    //----------------Filter data follow searchParams------------------------
    useEffect(() => {
        if(allProductType) {
            let type = searchParams.get('type');
            let query = searchParams.get('query');
            let min = searchParams.get('min');
            let max = searchParams.get('max');
            if(type && type !== 'undefined') {
                let newSearchData = allProductType.filter(e => !!type.match(e.productType));
                if(query && query !== 'null' && query !== 'undefined') {
                    let newestSearchData = newSearchData.filter(e => e.productName.toLowerCase().includes(query.toLowerCase()) || e.seller.storeName.toLowerCase().includes(query.toLowerCase()));
                    if(max && max !== 'null' && max !== 'undefined'){
                        let priceMaxFiltered = newestSearchData.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price <= max : e.productOptions.sort((a,b) => a.price - b.price)[0].price <= max);
                        setProductData([...priceMaxFiltered]);
                        setSearchParams({type: type, query: query, max: max});
                        if(min && min !== 'null' && min !== 'undefined') {
                            let priceMinFiltered = priceMaxFiltered.filter(e => (e.productOptions === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                            setProductData([...priceMinFiltered]);
                            setSearchParams({type: type, query: query, min: min, max: max});
                        }
                    } else if(min && min !== 'null' && min !== 'undefined') {
                        let priceMinFiltered = newestSearchData.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                        setProductData([...priceMinFiltered]);
                        setSearchParams({type: type, query: query, min: min});
                    } else {
                        setProductData([...newestSearchData]);
                        setSearchParams({type: type, query: query});
                    }
                } else {
                    if(max && max !== 'null' && max !== 'undefined'){
                        let priceMaxFiltered =  newSearchData.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price <= max : e.productOptions.sort((a,b) => a.price - b.price)[0].price <= max);
                        setProductData([...priceMaxFiltered]);
                        setSearchParams({type: type, max: max});
                        if(min && min !== 'null' && min !== 'undefined') {
                            let priceMinFiltered = priceMaxFiltered.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                            setProductData([...priceMinFiltered]);
                            setSearchParams({type: type, max: max, min: min});
                        }
                    } else if(min && min !== 'null' && min !== 'undefined') {
                        let priceMinFiltered =  newSearchData.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                        setProductData([...priceMinFiltered]);
                        setSearchParams({type: type, min: min});
                    } else {
                        setProductData([...newSearchData]);
                        setSearchParams({type: type});
                    }     
                }   
            } else {
                if(query && query !== 'null' && query !== 'undefined') {
                    let newestSearchData = allProductType.filter(e => e.productName.toLowerCase().includes(query.toLowerCase()) || (e.seller.storeName.toLowerCase().includes(query.toLowerCase())));
                    if(max && max !== 'null' && max !== 'undefined'){
                        let priceMaxFiltered =  newestSearchData.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price <= max : e.productOptions.sort((a,b) => a.price - b.price)[0].price <= max);
                        setProductData([...priceMaxFiltered]);
                        setSearchParams({query: query, max: max});
                        if(min && min !== 'null' && min !== 'undefined') {
                            let priceMinFiltered = priceMaxFiltered.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                            setProductData([...priceMinFiltered]);
                            setSearchParams({query: query, max: max, min: min});
                        }
                    } else if(min && min !== 'null' && min !== 'undefined') {
                        let priceMinFiltered =  newestSearchData.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                        setProductData([...priceMinFiltered]);
                        setSearchParams({query: query, min: min});
                    } else {
                        setProductData([...newestSearchData]);
                        setSearchParams({query: query});
                    }

                } else {
                    if(max && max !== 'null' && max !== 'undefined'){
                        let priceMaxFiltered =  allProductType.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price <= max : e.productOptions.sort((a,b) => a.price - b.price)[0].price <= max);
                        setProductData([...priceMaxFiltered]);
                        setSearchParams({max: max});
                        if(min && min !== 'null'&& min !== 'undefined') {
                            let priceMinFiltered = priceMaxFiltered.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                            setProductData([...priceMinFiltered]);
                            setSearchParams({max: max, min: min});
                        }
                    } else if(min && min !== 'null' && min !== 'undefined') {
                        let priceMinFiltered =  allProductType.filter(e => (e.productOptions.length === 1)? e.productOptions[0].price >= min : e.productOptions.sort((a,b) => b.price - a.price)[0].price >= min);
                        setProductData([...priceMinFiltered]);
                        setSearchParams({min: min});
                    } else {
                        setProductData([...allProductType]);
                        setSearchParams();
                    };
                };      
            };
        };
        
    }, [searchParams, allProductType, setSearchParams]);


    //------------------Sort data--------------------------
    useEffect(() => {
        if(productData.length > 0 && sort) {
            if(sort === 'Latest') {
                let data = [...productData];
                data.sort((a, b) => b.id - a.id);
                setProductData([...data]);
            } else if(sort === 'Price') {
                let data = [...productData];
                data.sort((a, b) => {
                    let aPrice ;
                    let bPrice ;
                    if(a.productOptions.length > 1) {
                        aPrice = a.productOptions.sort((c, d) => c.price - d.price)[0].price;
                    } else {
                        aPrice = a.productOptions[0].price;
                    };

                    if(b.productOptions.length > 1) {
                        bPrice = b.productOptions.sort((c, d) => c.price - d.price)[0].price;
                    } else {
                        bPrice = b.productOptions[0].price;
                    };
                    return aPrice - bPrice ;
                });
                console.log(data);
                setProductData([...data]);
            } else if(sort === 'Total Sold') {
                let data = [...productData];
                data.sort((a, b) => b.productSellCount - a.productSellCount);
                setProductData([...data]);
            } else if(sort === 'Star') {
                let data = [...productData];
                data.sort((a, b) => {
                    let aStar ;
                    let bStar ;
                    if(a.reviews.length > 0) {
                        let review = [...a.reviews];
                        let totalStar = 0;
                        for(let e of review) {
                            totalStar += e.reviewStar ;
                        };

                        aStar = totalStar/review.length ;
                    } else {
                        aStar = 0;
                    };

                    if(b.reviews.length > 0) {
                        let review = [...b.reviews];
                        let totalStar = 0;
                        for(let e of review) {
                            totalStar += e.reviewStar ;
                        };

                        bStar = totalStar/review.length ;
                    } else {
                        bStar = 0;
                    };
                    
                    return bStar - aStar ;

                });

                setProductData([...data]);
            };
            setSort();
        };
    }, [sort, productData]);


    return (
        <div>
            <NavBar 
                setSearchParams = {setSearchParams}
                setSearchQuery = {setSearchQuery}
                searchQuery = {searchQuery}
                searchParams = {searchParams}
                filterParams = {filterParams}
                setSideBarParams = {setSideBarParams}
                priceFilterParams = {priceFilterParams}
                sideBarParams = {sideBarParams}
                allProductType = {allProductType}
                getParams = {getParams}
                getPrice = {getPrice}
                setSort = {setSort}
            />
            <div className='homePage'>
                <div className='homeSidebar'>
                    <HomeSidebar productData = {allProductType} sentSideParams = {getParams} searchParams={searchParams} />
                </div>
                <div className='homeContent'>
                    <div className='productCardContainer'>
                        {productData?.map(el => <div key={el.id}><ProductCard data = {el}/></div>)}
                    </div>
                </div>   
            </div>
        </div>
    )      
}

export default Home;