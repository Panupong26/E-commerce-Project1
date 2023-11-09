import { useEffect, useState } from 'react';
import '../CSS-file/component-css/image-slide.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../env';


function ProductImageSlide(props) {
    const [imageArr, setImageArr] = useState();
    const [arrPosition, setArrPosition] = useState();
    const [positionButtonColorDefault, setPositionButtonColorDefault] = useState();
    const circleActiveColor = 'rgb(100, 100, 100)';

    const [positionButtonColor, setPositionButtonColor] = useState();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [buttonDis, setButtonDis] = useState('none');
    const [positionButtonDis, setPositionButtonDis] = useState();

    function clearpositionButtonColor() {
        setPositionButtonColor(positionButtonColorDefault);
    }
   
    function selectPositionImg(value) {
        let box = document.getElementById(props.id);
        box.scrollTo({left: value, behavior: 'smooth'});
    }

    useEffect(() => {
        clearpositionButtonColor();
        setPositionButtonColor(prev => {return{...prev, [currentPosition]: circleActiveColor}});
        
        // eslint-disable-next-line
    }, [currentPosition]);


    useEffect(() => {
        setImageArr(props.productShowPic);
    }, [props.productShowPic]);

    useEffect(() => {
        if(props.productShowPic) {

            let preArrPosition = [];
            let prePositionButtonColor = {};
            let prePositionButtonColorDefault = {};
            for(let i = 0 ; i < props.productShowPic.length ; i++) {
                preArrPosition.push(i)
                if(currentPosition > props.productShowPic.length - 2) {
                    prePositionButtonColor[i] = i === props.productShowPic.length-1 ? circleActiveColor : '';
                    setCurrentPosition(props.productShowPic.length-1);
                } else {
                    prePositionButtonColor[i] = i === currentPosition ? circleActiveColor : '';
                }
                prePositionButtonColorDefault[i] = '';
            }
    
            setPositionButtonColor(prePositionButtonColor);
            setArrPosition([...preArrPosition]);
            setPositionButtonColorDefault({...prePositionButtonColorDefault});
            setPositionButtonDis(() => {if(props.productShowPic.length === 1) {return 'none'}});
        }
    }, [props.productShowPic, currentPosition]); 

    if(props.productShowPic && arrPosition) {
        return (
            <div className='bigCardImageBox'  onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')}>
                <div id={props.id} className='bigCardImageSlideBox' >
                    {imageArr.map((e) => {
                        if(e.productId && !e.picture.includes('blob')) {
                            return <div key={e.id} className='bigCardSlideImage'><img src = {`${API_URL}/productpic/${e.picture}`}  alt='Product' /></div>
                        } else if(e.optionId && !e.picture.includes('blob')) {
                            return <div key={e.id} className='bigCardSlideImage'><img src={`${API_URL}/optionpic/${e.picture}`}  alt='Product' /></div>
                        } else {
                            return <div key={e.id} className='bigCardSlideImage'><img src={e.picture} alt='Product' /></div>
                        }
                        
                    })}
                </div>

                <div className='positionBox' onMouseOver={() => {if(imageArr.length > 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')} >
                    {arrPosition.map((e) => <button key = {e} style = {{color: positionButtonColor[e], display: positionButtonDis}} onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')}
                    onClick={() => {
                        let box = document.getElementsByClassName('bigCardImageBox');
                        selectPositionImg(e *  box[0].offsetWidth + 1);
                        setCurrentPosition(e);
                    }} ><FontAwesomeIcon icon={faCircle} /></button>)}
                </div>


                <button className='rightSlide' style={{display: buttonDis}} onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')} 
                onClick={() => {
                    if(currentPosition < arrPosition.length - 1) {
                        let box = document.getElementsByClassName('bigCardImageBox');
                        selectPositionImg((currentPosition + 1) * box[0].offsetWidth)
                        setCurrentPosition(currentPosition + 1);   
                    }
                }} ><FontAwesomeIcon icon={faChevronRight} /></button>
                
                
                <button className='leftSlide' style={{display: buttonDis}} onMouseOver={() => {if(imageArr.length !== 1) {setButtonDis()}}} onMouseLeave = {() => setButtonDis('none')} 
                onClick={() => {
                    if(currentPosition > 0) {
                        let box = document.getElementsByClassName('bigCardImageBox');
                        selectPositionImg((currentPosition - 1) * box[0].offsetWidth);
                        setCurrentPosition(currentPosition - 1);
                    }
                }}><FontAwesomeIcon icon={faChevronLeft} /></button>
            </div>   
        );
    }    
}

export default ProductImageSlide