import { useContext, useEffect, useState } from 'react';
import '../CSS-file/modal-css/product-edit.css';
import axios from "../config/Axios";
import { FONTEND_URL } from '../env';
import { toast } from 'react-toastify';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';




function ProductOptionAdd(props) {
    const [newOption, setNewOption] = useState();
    const [newOptionPrice,setNewOptionPrice] = useState(); 
    const [validateOk, setValidateOk] = useState(true);
   
    const [addOptionDoneButtonDisable, setAddOptionDoneDisable] = useState('none');

    const { setIsLoading } = useContext(loadingContext);


    async function addProductOption() {
        setIsLoading(true);

        await axios.post(`/productoption/createproductoption`, {
            productId: props.productId,
            optionName: newOption,
            price: +(newOptionPrice.replaceAll(',',''))
        })
        .then(res => {
            window.location.href = `${FONTEND_URL}/product/${res.data.productId}/${res.data.id}`;
        })
        .catch(err => {
            handleErr(err);
        })
        .finally(() => {
            setIsLoading(false);
        })
    };



    useEffect(() => {
        let sameOption;
        if(newOption) {
            sameOption = props.productOption.filter(e => e.optionName.toLowerCase().replaceAll(' ', '') ===  newOption.toLowerCase().replaceAll(' ', ''));
        }
        if(sameOption && sameOption[0]) {
            toast.error('This name already exists', {
                position: 'top-center',
                autoClose: 1000
            })
            setValidateOk(false);
        } else {
            setValidateOk(true);
        } 
        let result = ( newOption && `${+newOption}` === 'NaN' && !sameOption[0] && newOptionPrice && +newOptionPrice.replaceAll(',','') > 0 )? '' : 'none' ;
        setAddOptionDoneDisable(result);
    }, [newOption, newOptionPrice, props])


    return <>
        <div className='modal-bg' onClick={() => props.setProductModal()}>
            <div className="productOptionAddBox" onClick={e => e.stopPropagation()}>
                <div className='addOptionHeader'>Option</div>
                
                <input 
                    type='text' 
                    value={newOption || ''} 
                    style={{color: `${validateOk ? '' : 'red'}`}} 
                    onChange = {(e) => setNewOption(e.target.value)}
                />
                
                <div className='addOptionPriceHeader'>Price</div>
                
                <input 
                    type='text' value={newOptionPrice || ''}  
                    onChange = {(e) => {
                        if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                            setNewOptionPrice('0');
                        } else {
                            setNewOptionPrice((+e.target.value.replaceAll(',','')).toLocaleString());
                        }
                }}/>

                <div className='addOptionButtonBox'>
                    <button className='addOptionDoneButton' style={{pointerEvents: addOptionDoneButtonDisable}} onClick = {() => addProductOption()}>Add</button>
                    <button className='addOptionCancleButton' onClick={() => props.setProductModal()}>Cancle</button>
                </div>
            </div>
        </div>
    </>
    
}

export default ProductOptionAdd
