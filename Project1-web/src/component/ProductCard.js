
import '../CSS-file/component-css/product-card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { DEFAULT_AVATAR, NOTFOUND_PICTURE, FONTEND_URL, API_URL } from '../env';

function ProductCard({ data }) {
    const seller = data.seller;

    const showPrice = () => {
        if(data && data.productOptions && data.productOptions.length > 0) {
            if(data.productOptions.length > 1) {
                let arr = [...data.productOptions]
                arr.sort((a,b) => a.price-b.price);
                let startShow = arr[0].price >= 1000000? (arr[0].price / 1000000).toFixed(0) + 'M' : arr[0].price.toLocaleString();
                let endShow =  arr[arr.length - 1].price >= 1000000? (arr[arr.length - 1].price / 1000000).toFixed(0) + 'M' :  arr[arr.length - 1].price.toLocaleString();
                return startShow + '-' + endShow;
            } else {
                return data.productOptions[0].price.toLocaleString();
            }
        }
    }

   

    return (
        <div className='card'>
            <div className='sellerOnCard'>
                <div onClick = {() => window.location.href = `${FONTEND_URL}/${seller?.storeName}`}>
                    <img className='cardImg' src={seller?.storePicture? `${API_URL}/sellerprofilepic/${seller.storePicture}` : DEFAULT_AVATAR} alt='Seller'/>
                </div>
        
            
                <div onClick = {() => window.location.href = `${FONTEND_URL}/shop/${seller?.storeName}`}>
                    {seller?.storeName.length > 20 ? seller.storeName.slice(0, 19) + '...' : seller.storeName}
                </div>
            </div>
            <div className = 'productCardClickArea' onClick = {() => window.location.href = `${FONTEND_URL}/product/${data?.id}`}>
                <img className = 'productPicOnCard' 
                    src={(data?.productPictures &&  !!data?.productPictures[0])? `${API_URL}/productpic/${data.productPictures[0].picture}` : NOTFOUND_PICTURE} alt='Product' />
            
                <div className='productNameOnCard'> 
                    {data?.productName.length > 15 ? data.productName.slice(0,14) + '...' : data.productName}
                </div>
                
                <div className='productDetailOnCard'> 
                    {data?.productDetail.length > 50 ? data.productDetail.slice(0,49) + '...' : data.productDetail}
                </div>
                
                <div className='productCardSellCount'>
                    <FontAwesomeIcon icon={faCircleCheck} style={{color: "yellowgreen",}}/>&nbsp;
                    {data?.productSellCount.toLocaleString()}
                </div>
                
                <div className='productPriceOnCard'> 
                    {showPrice()} THB  
                </div>
            </div>    
        </div>
   
    )
}

export default ProductCard