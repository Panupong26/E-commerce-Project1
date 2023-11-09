import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import ProductImageSlide from '../component/ProductImageSlide';
import '../CSS-file/page-css/add-product.css'
import axios from '../config/Axios';
import { FONTEND_URL } from '../env';
import { authContext } from '../context/AuthContextProvider';
import { loadingContext } from '../context/LoadingContextProvider';
import { toast } from 'react-toastify';
import { handleErr } from '../handle-err/HandleErr';


function SellerAddProduct() {
    const { authUser: sellerData } = useContext(authContext)
    const [productData, setProductData] = useState();
   
    const [productShowPic, setProductShowPic] = useState([]);
    const [file, setFile] = useState([]);

    const [productName, setProductName] = useState();
    const [productType, setProductType] = useState();
    const [productDetail, setProductDetail] = useState();
    const [productOption, setProductOption] = useState();
    const [productOptionPrice, setProductOptionPrice] = useState();
    const [sentOption, setSentOption] = useState();
    const [sentOptionPrice, setSentOptionPrice] = useState();
    const [sentAmount, setSentAmount] = useState();

    const [sellerAddProductEditPicDis, setSellerAddProductEditPicDis] = useState();
    const [defaultDis, setDefaultDis] = useState();
    const [addProductButtonDisable, setAddProductButtonDisable] = useState(true);
    const [validateOk, setValidateOk] = useState(true);

    const { setIsLoading } = useContext(loadingContext);
   
       
    function addFile(e) {
        if(e.target.files[0]) {
            const time = new Date().getTime();
            const newId = 'o' + time;
            const type = e.target.files[0].type.split('/')[1];
            const newName = newId + '.' + type;
            const newFile = new File(e.target.files, newName, {type: e.target.files[0].type});
            setFile([...file, newFile]);
            setProductShowPic([...productShowPic, {id: newId, picture: URL.createObjectURL(e.target.files[0])}]);
            
            e.target.value = null;
        }
    } 

     
    function editFile(data, e) {
        if(e.target.files[0]) {
            console.log(data);
            console.log(file);
            const type = e.target.files[0].type.split('/')[1];
            const newName = data.id + '.' + type;
            const newFile = new File(e.target.files, newName, {type: e.target.files[0].type});
            const index = file.findIndex(el => el.name.split('.')[0] === data.id);
            
            const newArr = [...productShowPic];
            newArr[index] = {id: data.id, picture: URL.createObjectURL(e.target.files[0])}
            setProductShowPic([...newArr]);
            
            const newFileArr = [...file];
            newFileArr[index] = newFile;
            setFile([...newFileArr]);
            
            e.target.value = null;
        }
    } 


    function deleteFile(id) {
        const index = file.findIndex(el => el.name.split('.')[0] === id);
        const newArr = [...productShowPic];
        newArr.splice(index, 1);
        const newFileArr = [...file];
        newFileArr.splice(index, 1);
        setProductShowPic([...newArr]);
        setFile([...newFileArr]);
    }

    async function addProduct() {
        setIsLoading(true);
        const input = {
            productName: productName,
            productType: productType,
            productDetail: productDetail,
            productOption: productOption,
            productOptionPrice: +(productOptionPrice.replaceAll(',', '')),
            sentOption: sentOption,
            sentOptionPrice: +(sentOptionPrice.replaceAll(',', '')),
            sentAmount: +(sentAmount.replaceAll(',', ''))
        }

        const form = new FormData();
        
        for(let el of file) {
            form.append('productPicture', el)
        }
        
        form.append('input', JSON.stringify(input));
        
        await axios.post('/product/createproduct', form, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            window.location.href = `${FONTEND_URL}/product/${res.data.productId}/${res.data.optionId}`;
        })
        .catch(err => {
            handleErr(err);
        }) 
        .finally(() => {
            setIsLoading(false);
        })  
    }
   


    useEffect(() => {
        document.title = 'Create New Product';
    }, []);

    useEffect(() => {
        async function getProductData() {
            await axios.post(`/product/getproductbysellerid`, {sellerId: sellerData.id})
            .then(res => {
                setProductData(res.data);
            })
            .catch(err => {
                handleErr(err);
            })
        };


        if(sellerData) {
            getProductData();
        }
    }, [sellerData]);

    useEffect(() => {
        let preEditPicDis = {};
        productShowPic.forEach(e => preEditPicDis[e.id] = 'none')
        setSellerAddProductEditPicDis(preEditPicDis);
        setDefaultDis(preEditPicDis);
    }, [productShowPic]);

    useEffect(() => {
        let sameName;
        if(productName) {
            sameName = productData.find(e => e.productName.toLowerCase() === productName.toLowerCase());
        }
        
        if(sameName) {
            toast.error('This name already exists', {
                position: 'top-center',
                autoClose: 1000
            })
            setValidateOk(false);

        } else {
            setValidateOk(true);
        } 
       
        if(
          productName && 
          isNaN(+productName) &&
          !sameName && 
          productOption &&
          isNaN(+productOption) &&
          productOptionPrice && 
          +(productOptionPrice.replaceAll(',','')) > 0 && 
          productOptionPrice[0] !== 0 &&
          sentOption && 
          isNaN(sentOption) &&
          sentOptionPrice && 
          +(sentOptionPrice.replaceAll(',','')) >= 0 && 
          sentOptionPrice[0] !== 0 &&
          sentAmount && 
          +(sentAmount.replaceAll(',','')) > 0 && 
          sentAmount[0] !== 0 && 
          file.length > 0 && 
          productType && 
          productDetail
        ) {
            setAddProductButtonDisable(false);
        } else {
            setAddProductButtonDisable(true);
        }
    }, [productName, productOption, productOptionPrice, sentOption, sentOptionPrice, sentAmount, file, productType, productDetail, productData]);


  
    return <>
        <div>
            <div className = 'sellerAddProductPage'>
                <div className = 'sellerAddProductFlex'>
                    <div className = 'sellerAddProductPic'>
                        <ProductImageSlide productShowPic = {productShowPic} id = {sellerData?.id}/>
                    </div>
                    <div className='sellerAddProductMid'>
                        
                        <input 
                            className = 'sellerAddProductName' 
                            placeholder="Product's name" 
                            value={productName || ''} 
                            style={{color: `${validateOk ? '' : 'red'}`}}
                            onChange = {(e) => setProductName(e.target.value)}
                        />
                        
                        <select className = 'sellerAddProductType' onChange = {(e) => setProductType(e.target.value)}>
                            <option value="">-- Please choose product's type --</option>
                            <option value='Apparel & Accessories'>Apparel & Accessories</option>
                            <option value='Electronics'>Electronics</option>
                            <option value='Food & Beverages'>Food & Beverages</option>
                            <option value='Furniture'>Furniture</option>
                        </select>
                        
                        <div className = 'sellerAddProductOptionBox'>
                            <div className='sellerAddProductOptionHeader'>Primary Option</div>
                            <input 
                                className = 'sellerAddProductOption' 
                                placeholder="Product's primary option" 
                                value={productOption || ''} 
                                onChange = {(e) => {setProductOption(e.target.value)}}
                            />
                            <input 
                                className = 'sellerAddProductOption' 
                                placeholder="Primary option's price" 
                                value={productOptionPrice || ''} 
                                onChange = {(e) => {
                                    if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                                        setProductOptionPrice('0');
                                    } else {
                                        setProductOptionPrice((+e.target.value.replaceAll(',','')).toLocaleString());
                                    }
                                }}/>
                        </div>
                        <div className = 'sellerAddSentOptionBox'>
                            <div className='sellerAddSentOptionHeader'>Primary Shipping Option</div>
                            
                            <input 
                                className = 'sellerAddProductSentOption' 
                                placeholder="Product's primary shipping option" 
                                value={sentOption || ''} 
                                onChange = {(e) => setSentOption(e.target.value)}
                            />
                            
                            <input 
                                className = 'sellerAddProductSentOption' 
                                placeholder="Primary shipping's price" 
                                value={sentOptionPrice || ''} 
                                onChange = {(e) => {
                                    if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                                        setSentOptionPrice('0');
                                    } else {
                                        setSentOptionPrice((+e.target.value.replaceAll(',','')).toLocaleString());
                                    }
                                }}/>
                            
                            <input 
                                className = 'sellerAddProductSentOption' 
                                placeholder="Primary shipping's amount" 
                                value={sentAmount || ''} 
                                onChange = {(e) => {
                                    if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                                        setSentAmount('0');
                                    } else {
                                        setSentAmount((+e.target.value.replaceAll(',','')).toLocaleString());
                                    }
                                }}/>      
                        </div>  
                        <div className = 'sellerAddProductPicBox'>
                            <div className='sellerAddProductPicHeader'>Product's images</div>
                           
                            <div className='sellerAddProductPicFlex'>
                                {productShowPic.map(e => 
                                    <div>
                                        <img src={e.picture} alt = 'product' onMouseOver={() => setSellerAddProductEditPicDis({...defaultDis, [e.id]: ''})}/>
                                        <div className='sellerAddProductEditPic' style={{display: sellerAddProductEditPicDis[e.id]}} onMouseLeave = {() => setSellerAddProductEditPicDis({...defaultDis, [e.id]: 'none'})}>
                                            <div className='sellerAddProductEditPicButton' onClick={() => document.getElementById('i' + e.id).click()}><FontAwesomeIcon icon={faPenToSquare}/></div>
                                            <div className='sellerAddProductRemovePicButton' onClick={() => deleteFile(e.id)}><FontAwesomeIcon icon={faXmark}/></div>
                                        </div>
                                        <input id={'i' + e.id}  type='file' accept='image/*' onChange={i => editFile(e, i)} style={{display: 'none'}}/>
                                    </div>
                                )}
                                
                                <div className='sellerAddProductPicButton' onClick={() => document.getElementById('addProductPic').click()}><FontAwesomeIcon icon={faPlus}/></div>
                                <input id='addProductPic' type='file' accept='image/*' onChange={e => addFile(e)} style={{display: 'none'}}/>
                            </div>
                                    
                        </div>  
                    </div>
                    <div>
                        
                        <div className = 'sellerAddProductDetailBox'>
                            <div className='sellerAddProductDetailHeader'>Product Detail</div>
                            <textarea className='sellerAddProductDetail' value={productDetail || ''} onChange={(e) => setProductDetail(e.target.value)}/>
                        </div>
                        <div className='sellerAddProductButtonBox' >
                                <button className='sellerAddProductButton' disabled = {addProductButtonDisable} onClick = {() => addProduct()}> Add Product </button>
                                <button className='sellerAddProductCancleButton' onClick={() => window.location.href = `${FONTEND_URL}/mystore`}> Cancle </button>  
                        </div>  

                    </div>
                </div>
            </div>
        </div>
    </>  
    
}    


export default SellerAddProduct