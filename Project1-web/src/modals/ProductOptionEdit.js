import '../CSS-file/modal-css/product-edit.css';
import ProductImageSlide from '../component/ProductImageSlide';
import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPenToSquare, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from "../config/Axios";
import { API_URL, FONTEND_URL } from '../env';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';


function ProductOptionEdit({ data, setProductModal }) {
    const [optionData, setOptionData]= useState();
    const [productEditShowPic, setProductEditShowPic] = useState();



    const [editPrice, setEditPrice] = useState();
    const [editId, setEditId] = useState([]);
    const [editFile, setEditFile] = useState([]);
    const [addFile, setAddFile] = useState([]);
    const [deleteFile, setDeleteFile] = useState([]);
    

    

    //---------event-----------
    const [isEditPrice, setIsEditPrice] = useState(false);
    const [defaultOpenEditPicButton, setDefaultOpenEditPicButton] = useState();
    const [openEditPicButton, setOpenEditPicButton] = useState();
    const [productEditDoneButtonDisable, setProductEditDoneButtonDisable] = useState('none');

    const { setIsLoading } = useContext(loadingContext);


    
    function addEditFile(data, el) {
        if(el.target.files[0]) {
            let newProductShowPic = [...productEditShowPic];
            let index = newProductShowPic.findIndex(p => p.id === data.id);
            newProductShowPic[index] = {id: data.id, optionId: data.optionId, picture: URL.createObjectURL(el.target.files[0])};
            setProductEditShowPic([...newProductShowPic]);

            if(typeof data.id === 'string') {
                const fileType = el.target.files[0].type.split('/')[1];
                const newName = data.id + '.' + fileType;
                const newFile = new File(el.target.files, newName, {type: el.target.files[0].type});
                const index = addFile.findIndex(e => e.name.split('.')[0] === data.id);
                const newArr = [...addFile];
                newArr[index] = newFile;
                setAddFile([...newArr]);
            } else {
                if(editId.find(e => e === data.id)) {
                    const index = editId.findIndex(e => e === data.id);
                    const newArr = [...editFile];
                    newArr[index] = el.target.files[0];
                    setEditFile([...newArr]);
                } else {
                    setEditId([...editId, data.id]);
                    setEditFile([...editFile, el.target.files[0]]);
                }            
            }
            el.target.value = null;
        }
    }

    function addNewFile(e) {
        if(e.target.files[0]) {
            let newProductShowPic = [...productEditShowPic];
            let newId = 'o' + optionData.id + '_' + new Date().getTime();
            newProductShowPic.push({id: newId, optionId: optionData.id, picture: URL.createObjectURL(e.target.files[0])});
            setProductEditShowPic([...newProductShowPic]);
           
            const fileType = e.target.files[0].type.split('/')[1];
            const newName = newId + '.' + fileType;
            const newFile = new File(e.target.files,  newName, {type: e.target.files[0].type});
            setAddFile([...addFile, newFile]); 
            
            e.target.value = null;
        }   
    }

    function addDeleteFile(id) {
        const newArr = productEditShowPic.filter(e => e.id !== id);
        setProductEditShowPic([...newArr]);

        if(typeof id === 'string') {
            const newArr = [...addFile].filter(e => e.name.split('.')[0] !== id);
            setAddFile([...newArr])     
        } else {
           setDeleteFile([...deleteFile, id]);
           if(editId.find(e => e === id)) {
                const index = editId.findIndex(e => e === id);
                const newArr = [...editFile];
                newArr.splice(index, 1);
                setEditFile([...newArr]);
                const newIdArr = [...editId].filter(e => e !== id);
                setEditId([...newIdArr]);
           }
        }
    }


    async function update() {
        setIsLoading(true);

        const AddForm = new FormData(); 
        AddForm.append('optionId', optionData.id)
        if(addFile.length > 0) {
            for(let el of addFile) {
                AddForm.append('optionPicture', el);
            }
        }

        const EditForm = new FormData(); 
        if(editFile.length > 0) {
            for(let el of editFile) {
                EditForm.append('optionPicture', el);
            }
            EditForm.append('idArr', JSON.stringify(editId));
        }

        const reqAdd = addFile.length > 0 ? await axios.post('/productoption/addpicture', AddForm, {headers: {'Content-Type': "multipart/form-data"}}).catch((err) => handleErr(err)) : Promise.resolve() ;
        const reqEdit = editFile.length > 0 ? await axios.post('/productoption/editpicture', EditForm, {headers: {'Content-Type': "multipart/form-data"}}).catch((err) => handleErr(err)) : Promise.resolve() ;
        const reqDelete = deleteFile.length > 0 ? await axios.delete('/productoption/deletepicture', {data: {deleteArr: deleteFile}}).catch((err) => handleErr(err)) : Promise.resolve() ;
        const updatePrice = await axios.patch('/productoption/updateprice', {id: optionData.id, price: editPrice.replaceAll(',','')});
        
        
        Promise.all([reqAdd, reqEdit, reqDelete, updatePrice])
        .then(() => {
            window.location.href = `${FONTEND_URL}/product/${data.productId}`;
        })
        .finally(() => {
            setIsLoading(false);
        })

    }

    useEffect(() => {
        if(data) {
            setOptionData(data);
            setEditPrice(data.price.toLocaleString());
            setProductEditShowPic([...data.optionPictures]);
        }
    }, [data])



    useEffect(() => {
        if(productEditShowPic && productEditShowPic.length > 0 ) {
            let preOpenEditPicButton = {};
            productEditShowPic.forEach(e => preOpenEditPicButton[e.id] = false);
            setOpenEditPicButton({...preOpenEditPicButton});
            setDefaultOpenEditPicButton({...preOpenEditPicButton});
        }     
    }, [productEditShowPic]);




    useEffect(() => { 
        if( (editFile[0] || addFile[0] || deleteFile[0] || editPrice  !== data.price.toLocaleString()) && (!isEditPrice && editPrice !== '0')) {   
            setProductEditDoneButtonDisable(''); 
        } else {
            setProductEditDoneButtonDisable('none');
        }
       
    }, [editPrice, editFile, addFile, deleteFile, isEditPrice, data]);

    
    return <>
        <div className='modal-bg' onClick={() => setProductModal()}>
            <div className="productOptionEditBox" onClick={e => e.stopPropagation()}>
                <div className='sellerProductEditImageSlideBox'>
                    {<ProductImageSlide productShowPic = {productEditShowPic || []} id = {'o' + optionData?.id}/>}
                </div>
                <div className='productOptionEditArea'>
                    <div className='optionName'>{optionData?.optionName}</div>
                    <div className='optionPrice'>
                        
                        <div className='optionPriceHeader'>Price</div>
                        <input  
                            type='text' 
                            value={editPrice || ''}
                            placeholder = {optionData?.price.toLocaleString()} 
                            disabled = {!isEditPrice} 
                            onChange = {(e) => {
                                if((+e.target.value.replaceAll(',','')).toLocaleString() === 'NaN') {
                                    setEditPrice('0');
                                } else {
                                    setEditPrice((+e.target.value.replaceAll(',','')).toLocaleString());
                                }
                            }}
                        />
                       
                        {!isEditPrice &&
                        <button onClick={() => {
                           setIsEditPrice(true);
                        }}><FontAwesomeIcon icon={faPenToSquare}/></button>
                        }
                        
                        {isEditPrice &&
                        <button onClick={() => {
                            setIsEditPrice(false);
                        }}><FontAwesomeIcon icon={faCheck}/></button>
                        }
                    
                    </div>
                    
                    <div className='productEditPicCardBox'>
                        {productEditShowPic?.map(e => 
                            <div key={e.id} className='productEditPicCard'>
                                <img 
                                    src={e.picture.includes('http')? e.picture : `${API_URL}/optionpic/${e.picture}`} alt='Option'
                                    onMouseOver={() => setOpenEditPicButton({...openEditPicButton, [e.id]: true})}
                                />

                                {openEditPicButton && openEditPicButton[e.id] &&
                                <div className='productEditPicCover'  onMouseLeave={() => setOpenEditPicButton({...defaultOpenEditPicButton})}>
                                    <div className='productEditPicButton'>
                                        <FontAwesomeIcon icon={faPenToSquare} onClick = {() => document.getElementById('i' + e.id).click()}/>
                                    </div>
                                    <div className='productDeletePicButton'>
                                        <FontAwesomeIcon icon={faXmark} onClick = {() => addDeleteFile(e.id)}/>
                                    </div>
                                </div>
                                }

                                <input id={'i' + e.id} type='file' accept="image/*" style={{display: 'none'}} onChange = {i => addEditFile(e, i)}/>
                            </div>
                        )}
                        <div className='productAddPicButton' onClick={() => document.getElementById('addNewPic').click()}><FontAwesomeIcon icon={faPlus}/></div>
                        <input id='addNewPic' type='file' accept="image/*" style={{display: 'none'}} onChange = {i => addNewFile(i)}/>
                    </div>
                    
                    <div className='productEditButtonBox'>
                        <button className='productEditDoneButton' style={{pointerEvents: productEditDoneButtonDisable}} onClick = {() => update()}>Done</button>
                        <button className='productEditCancleButton' onClick={() => setProductModal()} >Cancle</button>
                    </div>
                
                </div>
            </div>
        </div>
    </>
    
}

export default ProductOptionEdit