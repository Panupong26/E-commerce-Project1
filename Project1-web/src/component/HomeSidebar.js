import '../CSS-file/component-css/home-sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faXmark} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';




function HomeSidebar(props) {

    const [defaultTypeButtonState, setDefaultTypeButtonState] = useState();
    const [defaultTypeActiveButtonState, setDefaultTypeActiveButtonState] = useState();
    const [typeArr,setTypeArr] = useState(); // type to show on sidebar
    const [allTypeArr,setAllTypeArr] = useState(); // default type to show on sidebar

    
    const [homeSidebarLeft, setHomeSidebarLeft] = useState('-250px');
    const [typeButtonState, settypeButtonState] = useState();
    const [typeActiveButtonState,settypeActiveButtonState] = useState();
    const [searchSidebarQuery, setSearchSidebarQuery] = useState(''); 

    const [typeParams, setTypeParams] = useState(props.searchParams); //Value from sidebar that will sent to set searchParams

 

    function clearActiveButton() {
        settypeButtonState(defaultTypeButtonState);
        settypeActiveButtonState(defaultTypeActiveButtonState);
    }

    //*** Search type on sidebar ***
    useEffect(() => {
        if(searchSidebarQuery === '') {
            setTypeArr(allTypeArr);
        } else if(typeArr) {
            let newTypeArr = allTypeArr.filter(e => e.toUpperCase().includes(searchSidebarQuery.toUpperCase()));
            setTypeArr(newTypeArr);
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchSidebarQuery])


    //*** Change button on sidebar to active follow searchParams if searchParams only have one type ***
    useEffect(() => {
        let type = props.searchParams.get('type')
        if(typeButtonState && typeActiveButtonState && typeButtonState[type] && typeActiveButtonState[type]) {
            clearActiveButton();
            settypeButtonState((prev) => {return{...prev, [type]: 'none'}});
            settypeActiveButtonState((prev) => {return{...prev, [type]: 'list-item'}});
        } else {
            clearActiveButton();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.searchParams])

    
    // *** Create sidebar type and display state ***
    useEffect(() => {
        if(props.productData) {
            let preTypeArr = [];
            let preTypeButtonState = {};
            let preTypeActiveButtonState = {};
            props.productData.forEach(e => {
                if(!preTypeArr.filter(i => i === e.productType)[0]) {
                    preTypeArr.push(e.productType);
                    preTypeButtonState[e.productType] = 'list-item';
                    preTypeActiveButtonState[e.productType] = 'none';
                };  
            });
            setTypeArr([...preTypeArr]);
            setAllTypeArr([...preTypeArr]);
            setDefaultTypeButtonState({...preTypeButtonState});
            setDefaultTypeActiveButtonState({...preTypeActiveButtonState}); 
            settypeButtonState({...preTypeButtonState});
            settypeActiveButtonState({...preTypeActiveButtonState}); 
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [props.productData]);

    //Send value to homepage for change searchParams----------------------------
    useEffect(() => {
       props.sentSideParams(typeParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeParams]);


    return (
        <div className="homeSideBar" style={{left: homeSidebarLeft}} onMouseLeave={() => setHomeSidebarLeft('-250px')}> 
            
            <div className='homeCategory'><FontAwesomeIcon icon={faBoxesStacked} /> Category</div>
            <div className='homeTypeSearch'>
                <input type='text' placeholder='Search category here' value={searchSidebarQuery} onChange = {(e) => setSearchSidebarQuery(e.target.value)}/>
                <button><FontAwesomeIcon icon={faXmark} onClick={() => setSearchSidebarQuery('')}/></button>
            </div>
            <ul className='homeTypeList'>    
                {typeArr?.map(e => 
                    <div key={e}>
                        <li className='homeTypeButton' style={{display: typeButtonState[e]}} onClick={() => {
                            clearActiveButton();
                            settypeButtonState((prev) => {return{...prev, [e]: 'none'}});
                            settypeActiveButtonState((prev) => {return{...prev, [e]: 'list-item'}});
                            setTypeParams((prev) => {return{...prev, type: e}});
                        }}>{e}</li>
                        <li className='homeTypeActiveButton' style={{display: typeActiveButtonState[e]}} onClick={() => {
                            settypeButtonState((prev) => {return{...prev, [e]: 'list-item'}});
                            settypeActiveButtonState((prev) => {return{...prev, [e]: 'none'}});
                            setTypeParams((prev) => {return{...prev, type: 'all'}});  
                        }}>{e}</li>
                    </div>
                )}
            </ul>
            
            <div className='homeSidebarShow' onClick={() => setHomeSidebarLeft('0px')}>
                <div>
                    <FontAwesomeIcon icon={faBoxesStacked} />
                    <br/><br/>C<br/>A<br/>T<br/>E<br/>G<br/>O<br/>R<br/>Y<br/>             
                </div>
            </div>  
        </div>
    )
}

export default HomeSidebar





