import '../CSS-file/page-css/admin-product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons';
import axios from "../config/Axios"
import { useEffect, useState } from 'react';
import { FONTEND_URL } from '../env';
import { handleErr } from '../handle-err/HandleErr';





function AdminProductPage() {
    const [productData, setProductData] = useState([]);
    const [allProduct, setAllProduct] = useState();
    const [filteredProduct, setFilteredProduct] = useState();
    const [productIdInput, setProductIdInput] = useState();
    const [idfilteredProduct, setIdFilteredProduct] = useState();
    const [sort, setSort] = useState();
    const [minDate, setMinDate] = useState();
    const [maxDate, setMaxDate] = useState();
    const [totalValue, setTotalValue] = useState();
    const [totalSold, setTotalSold] = useState();

    const [apparelButtonDis,setApparelButtonDis] = useState();
    const [apparelActiveButtonDis,setApparelActiveButtonDis] = useState('none');
    const [electronicsButtonDis,setElectronicsButtonDis] = useState();
    const [electronicsActiveButtonDis,setElectronicsActiveButtonDis] = useState('none');
    const [foodButtonDis,setFoodButtonDis] = useState();
    const [foodActiveButtonDis,setFoodActiveButtonDis] = useState('none');
    const [furnitureButtonDis,setFurnitureButtonDis] = useState();
    const [furnitureActiveButtonDis,setFurnitureActiveButtonDis] = useState('none');

    const [sortMenuDis, setSortMenuDis] = useState('none');

    async function getProduct() {
        await axios.get(`/product/getallproduct`)
        .then(res => {
            setProductData([...res.data]);
            setAllProduct([...res.data]);
            setFilteredProduct([...res.data]);
        })
        .catch(err => {
            handleErr(err);
        })
    };


   function getPrice(e) {
        let data = e.productOptions.sort((a, b) => a.price - b.price);
        if(data && data.length > 1) {
            let arr = [...data]
            let startShow = arr[0].price >= 1000000? (arr[0].price / 1000000).toFixed(2) + 'M' : arr[0].price.toLocaleString();
            let endShow =  arr[arr.length - 1].price >= 1000000? (arr[arr.length - 1].price / 1000000).toFixed(2) + 'M' :  arr[arr.length - 1].price.toLocaleString();
            return startShow + '-' + endShow;
        } else if(data && data.length === 1) {
            return data[0].price.toLocaleString('th-TH', {style: 'currency', currency: 'THB'});
        };
    }

    function resetButton() {
        setApparelButtonDis();
        setApparelActiveButtonDis('none');
        setElectronicsButtonDis();
        setElectronicsActiveButtonDis('none');
        setFoodButtonDis();
        setFoodActiveButtonDis('none');
        setFurnitureButtonDis();
        setFurnitureActiveButtonDis('none');
    };


    useEffect(() => {
        document.title = 'Products';
        getProduct();
    }, [])

    useEffect(() => {
        if(filteredProduct) {
            if(productIdInput) {
                setIdFilteredProduct(filteredProduct.filter(e => e.id === +productIdInput));       
            } else {
                setIdFilteredProduct([...filteredProduct]);
            };
        };
    }, [productIdInput, filteredProduct])

    useEffect(() => {
        if(idfilteredProduct) {
            if(minDate) {
                if(maxDate) {
                    let min = +(minDate.replaceAll('-',''));
                    let max = +(maxDate.replaceAll('-',''));
                    let product = idfilteredProduct.filter(e => {
                        if(`${e.date}`.length > 1) {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}${e.date}`) >= min && +(`${e.year}${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}${e.date}`) >= min && +(`${e.year}0${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        } else {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}0${e.date}`) >= min && +(`${e.year}${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}0${e.date}`) >= min && +(`${e.year}0${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        };
                    });
                    setProductData([...product]);
                } else {
                    let min = +(minDate.replaceAll('-',''));
                    let date = new Date();
                    let day = `${date.getDate()}`.length > 1 ? `${date.getDate()}` : `0${date.getDate()}` ;
                    let month = `${date.getMonth()}`.length > 1 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}` ;
                    let year = `${date.getFullYear()}` ;
                    let max = +(year + month + day) ;
                    let product = idfilteredProduct.filter(e => {
                        if(`${e.date}`.length > 1) {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}${e.date}`) >= min && +(`${e.year}${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}${e.date}`) >= min && +(`${e.year}0${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        } else {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}0${e.date}`) >= min && +(`${e.year}${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}0${e.date}`) >= min && +(`${e.year}0${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        };
                    });
                    setProductData([...product]);
                };
            } else {
                if(maxDate) {
                    let max = +(maxDate.replaceAll('-',''));
                    let product = idfilteredProduct.filter(e => {
                        if(`${e.date}`.length > 1) {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        } else {
                            if(`${e.month}`.length > 1) {
                                if(+(`${e.year}${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if(+(`${e.year}0${e.month}0${e.date}`) <= max) {
                                    return true;
                                } else {
                                    return false;
                                }
                            };
                        };
                    });
                    setProductData([...product]);
                } else {
                    setProductData([...idfilteredProduct]);
                };    
            }
        }
    }, [minDate, maxDate, idfilteredProduct]);

    useEffect(() => {
        if(productData.length > 0) {
            let sumSold = 0;
            productData.forEach(e => {
                sumSold += e.productSellCount;
            });

            setTotalValue(productData.length.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').slice(0, productData.length.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').length - 3));
            setTotalSold(sumSold.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').slice(0, sumSold.toLocaleString('th-TH', {style: 'currency', currency: 'THB'}).replaceAll('฿', '').length - 3));
        } else {
            setTotalValue(0);
            setTotalSold(0);
        };
    }, [productData]);

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
                    if(a.productOptions?.length > 1) {
                        aPrice = a.productOptions?.sort((a, b) => a.price - b.price)[0].price;
                    } else {
                        aPrice = a.productOptions[0].price;
                    };

                    if(b.productOptions?.length > 1) {
                        bPrice = b.productOptions?.sort((a, b) => a.price - b.price)[0].price;
                    } else {
                        bPrice = b.productOptions[0].price;
                    };

                    return aPrice - bPrice ;
                });
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
                    if(a.reviews?.length > 0) {
                        let review = [...a.reviews];
                        let totalStar = 0;
                        for(let e of review) {
                            totalStar += e.reviewStar ;
                        };

                        aStar = totalStar/review.length ;
                    } else {
                        aStar = 0;
                    };

                    if(b.reviews?.length > 0) {
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

                console.log(data)
                setProductData([...data]);
            };
            setSort();
        };
    }, [sort, productData]);

   
    return <>
        <div>
            <div className='adminProductPage'>
                <div className='adminProductPageFilterBox'>
                    <button className='adminProductPageFilterButton' onClick={() => {
                        resetButton();
                        setApparelButtonDis('none');
                        setApparelActiveButtonDis();
                        setProductData(allProduct.filter(e => e.productType === 'Apparel & Accessories'));
                        setFilteredProduct(allProduct.filter(e => e.productType === 'Apparel & Accessories'));
                    }} style = {{display: apparelButtonDis}} >Apparel & Accessories</button>
                    <button className='adminOrderPageFilterActiveButton'  onClick={() => {
                        resetButton();
                        setApparelButtonDis();
                        setApparelActiveButtonDis('none');
                        setProductData(allProduct);
                        setFilteredProduct(allProduct);
                    }} style = {{display: apparelActiveButtonDis}} >Apparel & Accessories</button>
                    <button className='adminProductPageFilterButton'  onClick={() => {
                        resetButton();
                        setElectronicsButtonDis('none');
                        setElectronicsActiveButtonDis();
                        setProductData(allProduct.filter(e => e.productType === 'Electronics'));
                        setFilteredProduct(allProduct.filter(e => e.productType === 'Electronics'));
                    }} style = {{display: electronicsButtonDis}} >Electronics</button>
                    <button className='adminProductPageFilterActiveButton' onClick={() => {
                        resetButton();
                        setElectronicsButtonDis();
                        setElectronicsActiveButtonDis('none');
                        setProductData(allProduct);
                        setFilteredProduct(allProduct);
                    }} style = {{display: electronicsActiveButtonDis}} >Electronics</button>
                    <button className='adminProductPageFilterButton' onClick={() => {
                        resetButton();
                        setFoodButtonDis('none');
                        setFoodActiveButtonDis();
                        setProductData(allProduct.filter(e => e.productType === 'Food & Beverages'));
                        setFilteredProduct(allProduct.filter(e => e.productType === 'Food & Beverages'));
                    }} style = {{display: foodButtonDis}} >Food & Beverages</button>
                    <button className='adminProductPageFilterActiveButton' onClick={() => {
                        resetButton();
                        setFoodButtonDis();
                        setFoodActiveButtonDis('none');
                        setProductData(allProduct);
                        setFilteredProduct(allProduct);
                    }} style = {{display: foodActiveButtonDis}} >Food & Beverages</button>
                        <button className='adminProductPageFilterButton' onClick={() => {
                        resetButton();
                        setFurnitureButtonDis('none');
                        setFurnitureActiveButtonDis();
                        setProductData(allProduct.filter(e => e.productType === 'Furniture'));
                        setFilteredProduct(allProduct.filter(e => e.productType === 'Furniture'));
                    }} style = {{display: furnitureButtonDis}} >Furniture</button>
                    <button className='adminProductPageFilterActiveButton' onClick={() => {
                        resetButton();
                        setFurnitureButtonDis();
                        setFurnitureActiveButtonDis('none');
                        setProductData(allProduct);
                        setFilteredProduct(allProduct);
                    }} style = {{display: furnitureActiveButtonDis}} >Furniture</button>
                    <input className='adminFilterProductInput' placeholder='Find by Product Id' value={productIdInput} onChange={e => setProductIdInput(e.target.value)}/>
                    <input className='adminFilterProductInput' type='date' value={minDate} onChange={e => setMinDate(e.target.value)}/>
                    <FontAwesomeIcon icon={faRightLong} />
                    <input className='adminFilterProductInput' type='date' value={maxDate} onChange={e => setMaxDate(e.target.value)}/>
                    <div className='adminProductSortButton' onClick={() => setSortMenuDis()}><FontAwesomeIcon icon={faArrowUpWideShort} /></div>
                    <div className='adminProductSortMenuBox' style={{display: sortMenuDis}} onMouseLeave={() => setSortMenuDis('none')} >
                        <div onClick={() => setSort('Latest')}>Latest</div>
                        <div onClick={() => setSort('Price')}>Price</div>
                        <div onClick={() => setSort('Total Sold')}>Total Sold</div>
                        <div onClick={() => setSort('Star')}>Star</div>
                    </div>
                </div>
                <div className='productBoxHeader'>
                    <div className='headerProductRow'>
                            <div className='adminProductRowId'> Id </div>
                            <div className='adminProductName'> Product </div>
                            <div className='adminProductOption'> Option Quantity</div>
                            <div className='adminProductPrice'> Price </div>
                            <div className='adminProductTotalSold'> Total Sold </div>
                    </div>
                    
                    <div className='adminProductBox'>
                        {productData?.map((e) => 
                            <div key= {e.id} className='productRow' onClick={() => {
                                window.open(`${FONTEND_URL}/product/${e.id}`);
                            }}>
                                <div className='adminProductRowId'> {e.id} </div>
                                <div className='adminProductName'> {e.productName} </div>
                                <div className='adminProductOption'> {e.productOptions.length} </div>
                                <div className='adminProductPrice'> {getPrice(e)} </div>
                                <div className='productTotalSold'>{e.productSellCount}</div>
                            </div>
                        )}
                    </div>
                    
                    <div className='adminProductStaticBox'>
                        <div> Total Products: {totalValue}</div>
                        <div> Total Sold: {totalSold}</div>
                    </div>
                </div>
                
            </div>
        </div>
    </>
        
    
};

export default AdminProductPage