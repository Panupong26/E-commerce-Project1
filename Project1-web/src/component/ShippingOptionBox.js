import "../CSS-file/component-css/shipping-option.css"
import { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContextProvider";
import ProductSentOptionEdit from "../modals/ProductSentOptionEdit";
import ProductSentOptionAdd from "../modals/ProductSentOptionAdd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "../config/Axios" ;
import { loadingContext } from "../context/LoadingContextProvider";
import { handleErr } from "../handle-err/HandleErr";


export default function ShippingOptionBox({ productSentOption, setSentPrice, setSentOptionSelected, setSentAmount, setProductSentOption, productData, setProductModal }) {
    const { status } = useContext(authContext);
    const [defaultOptionActive, setDefaultOptionActive] = useState();
    const [optionActive, setOptionActive] = useState();

    const { setIsLoading } = useContext(loadingContext);

    async function deleteProductSentOption(id) {
        if(productSentOption.length !== 1) {
            setIsLoading(true);

            await axios.delete(`/shippingoption/deleteshippingoption`, {data:{optionId: id}})
            .then(() => {
                const newArr = productSentOption.filter(e => e.id !== id);
                setProductSentOption([...newArr]);
            })
            .catch(err => {
                handleErr(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
        }
    }


    useEffect(() => {
        if(productSentOption) {
            let preOptionActive = {};
            productSentOption.forEach(e => {
                preOptionActive[e.optionName] = false;
            });
            
            setDefaultOptionActive({...preOptionActive});
            setOptionActive({...preOptionActive});
        }
        
    }, [productSentOption])

    return <>
    <div className = 'sentOptionBox'>
        <div className='sentOptionHeader'>Shipping Option</div>
        {status === 'seller' &&
        <button className='addProductOptionButton' onClick={() => {
            setProductModal(<ProductSentOptionAdd productId = {productData.id} productSentOption = {productSentOption} setProductSentOption = {setProductSentOption} setProductModal = {setProductModal} />);
        }}><FontAwesomeIcon icon={faPlus}/></button>
        }
        <div className='sentOption'>
            {optionActive && productSentOption?.map(e => 
                <div key={e.id}>
                    {!optionActive[e.optionName] &&
                    <div className='sentOptionButton' onClick={() => {
                        setSentOptionSelected(e.optionName)
                        setSentPrice(e.price);
                        setSentAmount(e.amount);
                        setOptionActive({...defaultOptionActive, [e.optionName]: true});
                    }}>{e.optionName} {e.price.toLocaleString()} ฿/{e.amount.toLocaleString()} piece
                        {status === 'seller' &&
                        <>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div style={{display: 'inline-block'}}>
                            <FontAwesomeIcon icon={faPenToSquare} onClick = {() =>  {
                                setProductModal(<ProductSentOptionEdit data = {e} setProductModal = {setProductModal} productSentOption = {productSentOption} setProductSentOption = {setProductSentOption} />);
                            }} style = {{fontSize: '12px', marginBottom: '1px'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
                            <FontAwesomeIcon icon={faXmark} onClick = {() => deleteProductSentOption(e.id)} style = {{fontSize: '14px', marginTop: '1px'}}/>
                        </div> 
                        </>
                        }
                    </div> 
                    }

                    {optionActive[e.optionName] &&
                    <div className='sentActiveOptionButton' onClick={() => {
                        setSentOptionSelected('');
                        setSentPrice(0);
                        setSentAmount(0);
                        setOptionActive({...defaultOptionActive, [e.optionName]: false});
                    }}>{e.optionName} {e.price.toLocaleString()} ฿/{e.amount.toLocaleString()} piece
                        {status === 'seller' &&
                        <>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div style={{display: 'inline-block'}}>
                            <FontAwesomeIcon icon={faPenToSquare} onClick = {() =>  {
                                setProductModal(<ProductSentOptionEdit data = {e} setProductModal = {setProductModal} />);
                            }} style = {{fontSize: '12px', marginBottom: '1px'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
                            <FontAwesomeIcon icon={faXmark} onClick = {() => deleteProductSentOption(e.id)} style = {{fontSize: '14px', marginTop: '1px'}}/>
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
