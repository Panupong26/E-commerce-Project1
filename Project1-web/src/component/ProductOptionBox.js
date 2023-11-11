import { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import ProductOptionEdit from "../modals/ProductOptionEdit";
import ProductOptionAdd from "../modals/ProductOptionAdd";
import axios from "../config/Axios";
import { handleErr } from "../handle-err/HandleErr";
import { loadingContext } from "../context/LoadingContextProvider";
import "../CSS-file/component-css/product-option.css"

export default function ProductOptionBox({ productOption, setProductOption, setProductShowPic, setProductPrice, setOptionSelected, productData, setProductModal }) {
    const [defaultOptionActive, setDefaultOptionActive] = useState();
    const [optionActive, setOptionActive] = useState();
    const { status } = useContext(authContext);

    const { setIsLoading } = useContext(loadingContext);

    
    async function deleteProductOption(optionId) {
        if(productOption.length !== 1) {
            setIsLoading(true);
            await axios.delete(`/productoption/deleteproductoption`, {data: {optionId: optionId}})
            .then(() => {
                const newArr = [...productOption].filter(e => e.id !== optionId);
                setProductOption([...newArr]);
            }).catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
        }
    };

    function handleClickButton(e) {
        if(e.outOfStock) {
            return
        }

        if(e.optionPictures && e.optionPictures[0]) {
            setProductShowPic([...e.optionPictures]);
        } else {
            setProductShowPic([...productData.productPictures]); 
        }
        setOptionSelected(e.optionName);
        setProductPrice(e.price);
        setOptionActive({...defaultOptionActive, [e.optionName]: true});
    }

    function handleClickActiveButton(e) {
        setOptionSelected('')
        setProductPrice('');
        setProductShowPic([...productData.productPictures]); 
        setOptionActive({...defaultOptionActive, [e.optionName]: false});
    }

    useEffect(() => {
        if(productOption) {
            let preOptionActive = {};
            productOption.forEach(e => {
                if(productOption.length === 1 && !e.outOfStock) {
                    preOptionActive[e.optionName] = true;
                } else {
                    preOptionActive[e.optionName] = false;
                }
            });
            
            setDefaultOptionActive({...preOptionActive});
            setOptionActive({...preOptionActive});
        }
        
    }, [productOption])

    return <>
    <div className = 'productOptionBox'>
        <div className='productOptionHeader'>Product Option</div>
        {status === 'seller' &&
        <button className='addProductOptionButton' onClick={() => {
            setProductModal(<ProductOptionAdd productId = {productData.id} productOption = {productOption} setProductOption = {setProductOption} setProductModal = {setProductModal} />);
        }}><FontAwesomeIcon icon={faPlus}/></button>
        }
        <div className='productOption'>
            {optionActive && productOption?.map(e => 
                <div key={e.id}>
                    {!optionActive[e.optionName] &&
                    <div className='productOptionButton' onClick={() => handleClickButton(e)}>
                        {e.optionName}

                        {e.outOfStock && 
                        <div className="optionAlert">
                            OUT OF STOCK
                        </div>
                        }

                        {status === 'seller' &&
                        <>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div style={{display: 'inline-block'}}>
                           
                            <FontAwesomeIcon icon={faPenToSquare} onClick = {() =>  {
                                setProductModal(<ProductOptionEdit data = {e}  setProductModal = {setProductModal} />);
                            }} style = {{fontSize: '12px', marginBottom: '2px'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
                            
                            <FontAwesomeIcon icon={faXmark} onClick = {() => deleteProductOption(e.id)} style = {{fontSize: '14px'}}/>

                        </div>
                        </>
                        }
                    </div> 
                    }

                    {optionActive[e.optionName] &&
                    <div className='productActiveOptionButton' onClick={() => handleClickActiveButton(e)}>
                        {e.optionName}

                        {e.outOfStock && 
                        <div className="optionAlert">
                            OUT OF STOCK
                        </div>
                        }

                        {status === 'seller' &&
                            <>&nbsp;&nbsp;&nbsp;&nbsp;
                            <div style={{display: 'inline-block'}}>
                                <FontAwesomeIcon icon={faPenToSquare} onClick = {() =>  {
                                    setProductModal(<ProductOptionEdit data = {e}  setProductModal = {setProductModal} />);
                                }} style = {{fontSize: '12px', marginBottom: '2px'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
                                <FontAwesomeIcon icon={faXmark} onClick = {() => deleteProductOption(e.id)} style = {{fontSize: '14px'}}/>
                            </div>    
                            </>
                        }
                    </div> 
                    }
                </div>  
            )}
        </div>
    </div>
    </>
}