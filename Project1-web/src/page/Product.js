
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import '../CSS-file/page-css/product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft, faPlus, faMinus, faCashRegister, faCartPlus, faCircleCheck, faComments, faPenToSquare, faCheck, faStore, faStar } from '@fortawesome/free-solid-svg-icons';
import ProductImageSlide from '../component/ProductImageSlide';
import axios from '../config/Axios';
import { API_URL, DEFAULT_AVATAR, FONTEND_URL } from '../env';
import ProductOptionBox from '../component/ProductOptionBox';
import ShippingOptionBox from '../component/ShippingOptionBox';
import { authContext } from '../context/AuthContextProvider';
import OrderModal from '../modals/OrderModal';
import CommentModal from '../modals/CommentModal';
import { loadingContext } from '../context/LoadingContextProvider';
import { toast } from 'react-toastify';
import ProductOptionEdit from '../modals/ProductOptionEdit';
import { handleErr } from '../handle-err/HandleErr';




function Product(props) {
    // Navbar & Userpanel
    const { status, setCartData } = useContext(authContext)

    const {id, option} = useParams();
    const [sellerData, setSellerData] = useState();
    const [productDefaultData, setProductDefaultData] = useState();
    const [productData, setProductData] = useState();
    const [productStar, setProductStar] = useState();
    const [productOption, setProductOption] = useState();
    const [productSentOption, setProductSentOption] = useState();
    const [productShowPic, setProductShowPic] = useState();
    const [commentArr,setCommentArr] = useState();
    const [priceShow, setPriceShow] = useState();
    const [productPrice, setProductPrice] = useState();
    const [sentPrice, setSentPrice] = useState(0);  
    const [sentAmount, setSentAmount] = useState(0);
    const [optionSelected, setOptionSelected] = useState();
    const [totalOrderPrice, setTotalOrderPrice] = useState();
    const [amount,setAmount] = useState();
    const [sentOptionSelected, setSentOptionSelected] = useState();
    
   
    const [bigNameDis, setBigNameDis] = useState('none')
    const [openModal, setOpenModal] = useState(false);
    const [productModal, setProductModal] = useState();
    const [openComment, setOpenComment] = useState(false);
    const [amountButtonDisable,setAmountButtonDisable] = useState();
    const [isEdit, setIsEdit] = useState(false);

    const { setIsLoading } = useContext(loadingContext);

   

    async function adminDeleteProduct() {
        setIsLoading(true);

        await axios.delete(`/product/admindeleteproduct`, {productId: productData.id})
        .then(() => {
            window.location.replace(`${FONTEND_URL}/index`);
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(true);
        })
    }

    async function deleteProduct() {
        setIsLoading(true);

        await axios.delete(`/product/deleteproduct`, {data: {productId: +id}})
        .then(() => {
            window.location.replace(`${FONTEND_URL}/mystore`);
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })  
    }
    


    async function createCart() {
        setIsLoading(true);
        const cartPic =  (productShowPic[0].productId)? `${API_URL}/productpic/${productShowPic[0].picture}` : `${API_URL}/optionpic/${productShowPic[0].picture}` ;  
        const data = {
            productName: productData.productName,
            cartPicture: cartPic,
            productOption: optionSelected,
            shippingOption: sentOptionSelected,
            amount: amount,
            totalPrice: totalOrderPrice,
            productId: productData.id
        }                                   
        await axios.post(`/cart/createcart`, data)
        .then(() => {
            setCartData(prev => [...prev, data]);
            window.location.reload();
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    async function updateProductDetail() {
        setIsLoading(true);
        await axios.patch(`/product/updateproduct`, {
            productId: +id,
            productDetail: productData.productDetail
        })
        .then(() => {
            toast.success('Done!', {
                position: 'top-center',
                autoClose: 500
            });
        }).catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);  
        })
    }
    

    useEffect(() => {
        async function getProductData() {
            await axios.post(`/product/getproductbyproductid`, {productId: +id})
            .then(res => {
                setProductDefaultData({...res.data});
                setProductData({...res.data});
                setProductOption([...res.data.productOptions]);
                setProductSentOption([...res.data.shippingOptions]);
                setSellerData({...res.data.seller});
                setCommentArr([...res.data.reviews.sort((a, b) => b.id - a.id)]);
                setProductShowPic([...res.data.productPictures]);
            }).catch(err => {
                handleErr(err);
            })
        }

        getProductData();
    }, [id]);


    useEffect(() => {
        if(productData) {
            document.title = productData.productName;
        }
    }, [productData]);

    useEffect(() => {
        if(commentArr && commentArr[0]) {
            let totalStar = 0 ;
            commentArr.forEach(el => {
                totalStar += el.reviewStar
            });
            setProductStar(totalStar/commentArr.length);
        }
    }, [commentArr]);

    useEffect(() => {
        if(productOption) {
            if(productOption.length === 1) {
                setProductPrice(productOption[0].price);
                setProductShowPic(productOption[0].optionPictures[0]? productOption[0].optionPictures : productData.productPictures);
                setOptionSelected(productOption[0].optionName);
                setAmount(1);
            }

            if(option) {
                if(productOption.find(el => el.id === +option)) {
                    setProductModal(<ProductOptionEdit data = {productOption.find(el => el.id === +option)} setProductModal = {setProductModal}/>)
                } else {
                    window.location.href = `${FONTEND_URL}/product/${id}`;
                }
            }
        }
    }, [productOption, id, option, productData]);

   
    useEffect(() => {
        setAmountButtonDisable(() => {
            if(optionSelected) {
                if(amount === 1) {
                    return {increase: false, reduce: true, reset: false };
                } else {
                    return {increase: false, reduce: false, reset: false};
                } 
            } else {
                return {increase: true, reduce: true, reset: true};
            }
        });
        setAmount(() => {
            if(optionSelected) {
                if(amount) {
                    return amount;
                } else {
                    return 1;
                };
            } else {
                return '' ;
            }});


    }, [optionSelected, sentOptionSelected, amount]);

    useEffect(() => {
        setAmountButtonDisable(() => {
            if(amount) {
                if(amount === 1) {
                    return {increase: false, reduce: true, reset: false };
                } else {
                    return {increase: false, reduce: false, reset: false};
                }
            } else {
                return {increase: true, reduce: true, reset: true};
            }
        });

        setPriceShow(() => {
            if(optionSelected) {
                if(sentOptionSelected) {
                    let totalPriceShow = ((productPrice * amount)+(sentPrice * Math.ceil(amount/sentAmount)));
                    return  totalPriceShow.toLocaleString() + ' ฿';
                } else {
                    let totalPriceShow = productPrice * amount;
                    return  totalPriceShow.toLocaleString() + ' ฿';
                }  
            } else {
               return '' ;
            }
        })
        
        setTotalOrderPrice((productPrice * amount)+(sentPrice * Math.ceil(amount/sentAmount)));


    }, [amount, sentPrice, productPrice, optionSelected, sentAmount, sentOptionSelected]);



    
    return <>
        {openModal && 
            <OrderModal 
                productShowPic = {productShowPic} 
                productData = {productData} 
                optionSelected = {optionSelected}
                sentOptionSelected = {sentOptionSelected}
                amount = {amount}
                totalOrderPrice = {totalOrderPrice}
                sellerData = {sellerData}
                setOpenModal = {setOpenModal}
                priceShow = {priceShow}
            />
        }
        {openComment && <CommentModal commentArr = {commentArr} setOpenComment = {setOpenComment}/>}   
        
        {productModal}
        
        <div className = 'productPage'>
            <div className = 'productFlex'>
                <div className = 'productPic'>
                    <div className='productSeller'>
                        <div>
                            <img 
                                src={sellerData?.storePicture ? `${API_URL}/sellerprofilepic/${sellerData.storePicture}` : DEFAULT_AVATAR } alt='Seller' 
                                onClick={() => window.location.href = `${FONTEND_URL}/shop/${sellerData?.storeName}`}
                            />
                        </div>
                        <div onClick={() => window.location.href = `${FONTEND_URL}/shop/${sellerData?.storeName}`}>
                            {sellerData?.storeName} 
                        </div>  
                    </div>
                    <ProductImageSlide productShowPic = {productShowPic} id = {+id} size = {'100%'} />
                </div>
                
                
                <div className='productMid'>
                    <div className = 'productName' onClick={() => setBigNameDis()}>
                        {productData?.productName.length > 30? productData?.productName.slice(0,17) + '...' : productData?.productName }
                    </div>
                   
                    <div className = 'productFullName' style={{display: bigNameDis}} onMouseLeave = {() => setBigNameDis('none')}>
                        {productData?.productName}
                    </div>    
                    
                    <div className = 'productFeedbackBox'>
                        <div className='productStar'>{
                            [1,2,3,4,5].map(star => star <= productStar ? <span key={star}><FontAwesomeIcon icon={faStar} style={{color: "#00bfff",}} /></span> : <span key={star}><FontAwesomeIcon icon={faStar} style={{color: "#b7b9bd",}} /></span> )}
                        </div>
                        <div className='productSellCount'>
                            <FontAwesomeIcon icon={faCircleCheck} style={{color: "yellowgreen",}}/>&nbsp;
                            {productData?.productSellCount}
                        </div>
                        <button className='reviewButton' onClick={() => setOpenComment(true)}><FontAwesomeIcon icon={faComments} /></button>
                    </div>
                    
                    <ProductOptionBox 
                        productOption = {productOption} 
                        setProductOption = {setProductOption}
                        setProductShowPic = {setProductShowPic} 
                        setOptionSelected = {setOptionSelected} 
                        setProductPrice = {setProductPrice}
                        productData = {productData}
                        setProductModal = {setProductModal}
                    />
                    
                    <ShippingOptionBox
                        productSentOption = {productSentOption}
                        setProductSentOption = {setProductSentOption}
                        setSentPrice = {setSentPrice}
                        setSentOptionSelected = {setSentOptionSelected}
                        setSentAmount = {setSentAmount}
                        productData = {productData}
                        setProductModal = {setProductModal}
                    />
                    
                    <div className = 'productAmountBox'>
                        <div className='productShowAmount'>Amount</div>
                        {amount && <div className='productShowAmount'>{amount}</div>}
                        <div className='productShowAmountButton'>
                            <button disabled = {amountButtonDisable?.increase} onClick={() => setAmount(amount + 1)}><FontAwesomeIcon icon={faPlus} /></button>
                            <button disabled = {amountButtonDisable?.reduce} onClick={() => setAmount(amount - 1)}><FontAwesomeIcon icon={faMinus} /></button>
                            <button disabled = {amountButtonDisable?.reset} onClick={() => setAmount(1)}><FontAwesomeIcon icon={faArrowRotateLeft} /></button>
                        </div>
                    </div>
                    
                    <div className = 'productPrice'>
                        <div className='productPriceIcon'>Total Price</div> 
                        {priceShow && <div className='productPriceShow'>{priceShow}</div>}
                    </div>

                    {status === 'guest' &&
                    <div className='productOrderBox' >
                        <button className='productAddToCartButton' disabled = {!optionSelected || !sentOptionSelected} onClick = {() => window.location.href = `${FONTEND_URL}/login`}  ><FontAwesomeIcon icon={faCartPlus} /> Add To Cart </button>
                        <button className='productBuyNowButton' disabled = {!optionSelected || !sentOptionSelected} onClick = {() => window.location.href = `${FONTEND_URL}/login`}  ><FontAwesomeIcon icon={faCashRegister} /> Buy Now </button>  
                    </div> 
                    }
                
                    {status === 'user' &&
                    <div className='productOrderBox' >
                        <button className='productAddToCartButton' disabled = {!optionSelected || !sentOptionSelected} onClick = {() => {
                            createCart();
                        }} ><FontAwesomeIcon icon={faCartPlus} /> Add To Cart </button>
                        <button className='productBuyNowButton' disabled = {!optionSelected || !sentOptionSelected} onClick = {() => {
                            setOpenModal(true);
                        }} ><FontAwesomeIcon icon={faCashRegister} /> Buy Now </button>   
                    </div>
                    }

                    {status === 'admin' &&
                    <div className='productOrderBox' >
                        <button className='sellerProductDeleteButton' onClick={() => adminDeleteProduct()}> Delete product </button>
                    </div> 
                    } 

                    {status === 'seller' &&
                    <div className='sellerProductOrderBox' >
                        <button className='sellerProductDeleteButton' onClick={() => deleteProduct()}> Delete product </button>
                        <button className='sellerProductMyStoreButton' onClick={() => window.location.href = `${FONTEND_URL}/mystore`} ><FontAwesomeIcon icon={faStore} /> My store </button>  
                    </div>   
                    }  
                </div>


                {status !== 'seller' &&
                <div className = 'productDetailBox'>
                    <div className='productDetailHeader'>Product Detail</div>
                    <div className='productDetail'>
                        {productData?.productDetail}
                    </div>    
                </div>
                }

                {status === 'seller' &&
                <div className = 'sellerProductDetailBox'>
                    <div className='sellerProductDetailHeader'>Product Detail</div>
                    
                    {!isEdit && <button className='sellerEditProductDetailButton' onClick={() => {setIsEdit(true)}}><FontAwesomeIcon icon={faPenToSquare} /></button>}
                    
                    {isEdit &&
                    <button className='sellerEditDoneProductDetailButton'onClick={() => {
                        if(productData.productDetail !== productDefaultData.productDetail) {
                            updateProductDetail();
                        }
                        setIsEdit(false);
                    }}><FontAwesomeIcon icon={faCheck} /></button>
                    }
                    <textarea className='sellerProductDetail' disabled = {!isEdit}  value = {productData?.productDetail || ''} onChange = {e => setProductData({...productData, productDetail: e.target.value})}/>
                </div>
                }
            </div>
        </div>    
    </> 
};

export default Product

