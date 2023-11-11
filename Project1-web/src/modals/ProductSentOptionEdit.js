import '../CSS-file/modal-css/product-edit.css';
import {useContext, useEffect, useState} from 'react';
import axios from "../config/Axios";
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';



function ProductSentOptionEdit({ data, setProductModal, productSentOption, setProductSentOption }) {
    const [sentOption, setSentOption] = useState();
    
    const [editSentOptionPrice,setEditSentOptionPrice] = useState(); 
    const [editSentOptionQuantity,setEditSentOptionQuantity] = useState(); 
    
    const [editSentOptionDoneButtonDisable, setEditSentOptionDoneButtonDisable] = useState('none');
    
    const { setIsLoading } = useContext(loadingContext) ;



    async function updateSentOption() {
        setIsLoading(true)

        await axios.patch(`/shippingoption/updateshippingoption`, {
            optionId: sentOption.id,
            price: +(editSentOptionPrice.replaceAll(',','')),
            quantity: +(editSentOptionQuantity.replaceAll(',',''))
        })
        .then(res => {
           const index = productSentOption.findIndex(el => el.id === res.data.id);
           const newArr = [...productSentOption];
           newArr[index] = {...res.data}
           setProductSentOption([...newArr]);
           setProductModal();
        })
        .catch(err => {
           handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        if(data) {
            setSentOption({...data});
        }
    }, [data]);

    useEffect(() => {
        if(sentOption) {
            setEditSentOptionPrice(sentOption.price.toLocaleString());
            setEditSentOptionQuantity(sentOption.quantity.toLocaleString());
        }
    }, [sentOption]);

    useEffect(() => {
        let result = ( (editSentOptionPrice && +(editSentOptionPrice.replaceAll(',','')) > 0 && +(editSentOptionPrice.replaceAll(',','')) !== sentOption.price) || (editSentOptionQuantity && +(editSentOptionQuantity.replaceAll(',','')) > 0 && +(editSentOptionQuantity.replaceAll(',','')) !== sentOption.quantity))? '' : 'none' ;
        setEditSentOptionDoneButtonDisable(result);
    }, [editSentOptionPrice, editSentOptionQuantity, sentOption])

   
    return <>
        <div className='modal-bg' onClick={() => setProductModal()}>
            <div className="productSentOptionEditBox" onClick={e => e.stopPropagation()}>
                <div className='editSentOptionHeader'>Option</div>
                <input type='text' placeholder = {sentOption?.optionName} disabled = {true}/>
                
                <div className='editSentOptionPriceHeader'>Price</div>
                <input 
                    type='text' 
                    value={editSentOptionPrice || ''} 
                    placeholder = {sentOption?.price} 
                    onChange = {(e) => {
                        if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                            setEditSentOptionPrice('0');
                        } else {
                            setEditSentOptionPrice((+e.target.value.replaceAll(',','')).toLocaleString());
                        }
                    }}
                />
                
                <div className='editSentOptionPriceHeader'>Quantity</div>
                <input 
                    type='text' 
                    value={editSentOptionQuantity || ''} 
                    placeholder = {sentOption?.quantity} 
                    onChange = {(e) => {
                        if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                            setEditSentOptionQuantity('0');
                        } else {
                            setEditSentOptionQuantity((+e.target.value.replaceAll(',','')).toLocaleString());
                        }
                    }}
                />
                
                <div className='editSentOptionButtonBox'>
                    <button className='editSentOptionDoneButton' style={{pointerEvents: editSentOptionDoneButtonDisable}} onClick = {() => updateSentOption()}>Done</button>
                    <button className='editSentOptionCancleButton' onClick={() => setProductModal()}>Cancle</button>
                </div>
            </div>
        </div>
    </>
    
}

export default ProductSentOptionEdit
