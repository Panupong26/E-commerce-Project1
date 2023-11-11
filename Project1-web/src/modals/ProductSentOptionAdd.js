import '../CSS-file/modal-css/product-edit.css';
import {useContext, useEffect, useState} from 'react';
import axios from "../config/Axios";
import { toast } from 'react-toastify';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';




function ProductSentOptionAdd(props) {
    const [sentOption, setSentOption] = useState();

    const [newSentOption,setNewSentOption] = useState(); 
    const [newSentOptionPrice,setNewSentOptionPrice] = useState();  
    const [newSentOptionQuantity,setNewSentOptionQuantity] = useState(); 
    
    const [newSentOptionAddButtonDisable, setNewSentOptionAddButtonDisable] = useState('none');

    const [validateOk, setValidateOk] = useState(true);

    const { setIsLoading } = useContext(loadingContext);


    async function createSentOption() {
        setIsLoading(true);

        await axios.post(`/shippingoption/createshippingoption`, {
            productId: props.productId,
            optionName: newSentOption,
            price: +(newSentOptionPrice.replaceAll(',','')),
            quantity: +(newSentOptionQuantity.replaceAll(',',''))
        })
        .then(res => {
            props.setProductSentOption([...props.productSentOption, res.data]);
            props.setProductModal();
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
       if(props.productSentOption) {
            setSentOption([...props.productSentOption]);
       }
    }, [props.productSentOption]);

    useEffect(() => { 
        let sameSentOption = [] ;
       
        if(newSentOption) {
           sameSentOption = sentOption.filter(e => e.optionName.toLowerCase().replaceAll(' ','') === newSentOption.toLowerCase().replaceAll(' ',''));
        }

        if(sameSentOption && sameSentOption[0]) {
            toast.error('This name already exists', {
                position: 'top-center',
                autoClose: 1000
            })
            setValidateOk(false);
        } else {
            setValidateOk(true);
        } 

        let result = ( (newSentOption && `${+newSentOption}` === 'NaN' && sameSentOption && !sameSentOption[0]) && (newSentOptionPrice && +(newSentOptionPrice.replaceAll(',','')) > 0) && (newSentOptionQuantity && +(newSentOptionQuantity.replaceAll(',','')) > 0))? '' : 'none' ;
            setNewSentOptionAddButtonDisable(result);
    }, [newSentOption, newSentOptionPrice, newSentOptionQuantity, sentOption])


    return <>
        <div className='modal-bg' onClick={() => props.setProductModal()}>
            <div className="productSentOptionEditBox" onClick={e => e.stopPropagation()}>
                
                <div className='editSentOptionHeader'>Option</div>
                <input type='text'
                    value={newSentOption || ''} 
                    style={{color: `${validateOk ? '' : 'red'}`}} 
                    onChange = {e => setNewSentOption(e.target.value)}
                />
                
                <div className='editSentOptionPriceHeader'>Price</div>
                <input 
                    type='text' 
                    value={newSentOptionPrice || ''} 
                    onChange = {e => {
                        if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                            setNewSentOptionPrice('0');
                        } else {
                            setNewSentOptionPrice((+e.target.value.replaceAll(',','')).toLocaleString());
                        }
                    }}
                />
                
                <div className='editSentOptionPriceHeader'>Quantity</div>
                <input 
                    type='text' 
                    value={newSentOptionQuantity || ''}  
                    onChange = {e => {
                        if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                            setNewSentOptionQuantity('0');
                        } else {
                            setNewSentOptionQuantity((+e.target.value.replaceAll(',','')).toLocaleString());
                        }
                    }}
                />
                
                <div className='editSentOptionButtonBox'>
                    <button className='editSentOptionDoneButton' style={{pointerEvents: newSentOptionAddButtonDisable}} onClick = {() => createSentOption()}>Add</button>
                    <button className='editSentOptionCancleButton'onClick={() => props.setProductModal()}>Cancle</button>
                </div>
            </div>
        </div>
    </>
}

export default ProductSentOptionAdd
