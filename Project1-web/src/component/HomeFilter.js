
import '../CSS-file/component-css/home-filter.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faXmark, faTags, faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function HomeFilter(props) {

    const [typeArr,setTypeArr] = useState(); //Array to map button
    const [allTypeArr,setAllTypeArr] = useState(); //Defaul array to map button
    const [typeButtonState,setTypeButtonState] = useState(); 
    const [defaultTypeButtonState,setDefaultTypeButtonState] = useState();
    const [typeActiveButtonState,setTypeActiveButtonState] = useState();
    const [defaultTypeActiveButtonState,setDefaultTypeActiveButtonState] = useState();
    // eslint-disable-next-line
    const [productData, setProductData] = useState(props.productData);
    

 

    // eslint-disable-next-line
    const [searchParams,setSearchParams] = useSearchParams();
    const [searchFilterQuery, setSearchFilterQuery] = useState(''); //Query for finding button on filter box
    const [searchTypeArr,setSearchTypeArr] = useState([]); //Type value that will convert to string and sent to set serachParams
    const [priceFilter,setPriceFilter] = useState({min: '', max: ''});

   
    //Filter button follow search query
    useEffect(() => {
        if(allTypeArr) {
            let newFilterArr = allTypeArr.filter(e => e.toUpperCase().includes(searchFilterQuery.toUpperCase()));
            setTypeArr([...newFilterArr]);
        }
    }, [searchFilterQuery, allTypeArr])

   
    function clearActiveButton() {
        setTypeButtonState(defaultTypeButtonState);
        setTypeActiveButtonState(defaultTypeActiveButtonState);
    }

    function clearFilter() {
        clearActiveButton();
        setPriceFilter((prev) => {return{...prev, min: '', max: ''}});
        setSearchTypeArr([]);
    }

    //Create button and diaplay state
    useEffect(() => { 
        if(productData) {
            let typeButton = {};
            let typeActiveButton = {};
            let preTypeArr = [];
            productData.forEach(e => {
                if(!preTypeArr.filter(i => i === e.productType)[0]) {
                    preTypeArr.push(e.productType);
                    typeButton[e.productType] = 'inline-block';
                    typeActiveButton[e.productType] = 'none';
                };  
            });
            
            setTypeArr([...preTypeArr]);
            setAllTypeArr([...preTypeArr]);
            setTypeButtonState({...typeButton});
            setDefaultTypeButtonState({...typeButton});
            setTypeActiveButtonState({...typeActiveButton});
            setDefaultTypeActiveButtonState({...typeActiveButton});
        };
    },[productData]);

    //Set active button follow searchParams
    useEffect(() => {
        if(allTypeArr) {
            clearActiveButton();
            let typeString = searchParams.get('type');
            if(typeString !== null) {
                let arr = allTypeArr.filter(e => typeString.includes(e));
                arr.forEach(e => {
                    setTypeButtonState(prev => {return{...prev, [e]: 'none'}});
                    setTypeActiveButtonState(prev => {return{...prev, [e]: 'inline-block'}});
                });
                setSearchTypeArr(arr);
            } 
        }
    // eslint-disable-next-line
    },[searchParams, allTypeArr]);

    //Convert type value to string and sent to set searchParams
    useEffect(() => {
        let multiType = '';
        if(searchTypeArr[0]) {
            searchTypeArr.forEach(e => {
               if(multiType) {
                    multiType += `+${e}` ;
               } else {
                    multiType = e ;
               }
               
            });
        }
        props.sentFilterParams(multiType);   
    },[searchTypeArr, props]);

    //Sent min-max price to set searchParams
    useEffect(() => { 
        props.sentPrice(priceFilter);
    },[priceFilter, props]);

   

    if(typeArr) {
        return (
            <div className="filterContainer">
                <div className='homeFilterCategory'><FontAwesomeIcon icon={faBoxesStacked} /> Category</div>
                <button className='resetFilterButton' onClick={clearFilter}><FontAwesomeIcon icon={faArrowRotateLeft} /> Clear</button>
                <div className='homeFilterTypeSearch'>
                        <input type='text' placeholder='Search category here' value={searchFilterQuery} onChange = {(e) => setSearchFilterQuery(e.target.value)}/>
                        <button><FontAwesomeIcon icon={faXmark} onClick={() => setSearchFilterQuery('')}/></button>
                </div>
                <div className='homeFilterTypeList'>
                    {typeArr.map(e => 
                        <div key={e}> 
                            <div className='homeFilterTypeButton' style={{display: typeButtonState[e]}} onClick={() => {
                                setTypeButtonState((prev) => {return{...prev, [e]: 'none'}});
                                setTypeActiveButtonState((prev) => {return{...prev, [e]: 'block'}});
                                setSearchTypeArr((prev) => [...prev,e]);
                            }}>{e}</div>
                            <div className='homeFilterTypeActiveButton' style={{display: typeActiveButtonState[e]}} onClick={() => {
                                setTypeButtonState((prev) => {return{...prev, [e]: 'block'}});
                                setTypeActiveButtonState((prev) => {return{...prev, [e]: 'none'}});
                                let newArr = [...searchTypeArr];
                                newArr.splice(newArr.indexOf(e), 1);
                                setSearchTypeArr(newArr); 
                            }}>{e}</div>
                        </div>
                    )}
                </div>
                <div className='homeFilterPrice'><FontAwesomeIcon icon={faTags} /> Price</div>
                <input className='priceInput' type='number' placeholder='min' value={priceFilter.min} onChange={e => setPriceFilter((prev) => {return{...prev, min: e.target.value}})} />
                <input className='priceInput' type='number' placeholder='max' value={priceFilter.max} onChange={e => setPriceFilter((prev) => {return{...prev, max: e.target.value}})}/>
                <button className='priceFilterClearButton'><FontAwesomeIcon icon={faXmark} onClick={() => setPriceFilter((prev) => {return{...prev, min: '', max: ''}})}/></button>
            </div>
        )
    }
}

export default HomeFilter