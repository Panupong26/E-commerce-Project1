import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import '../CSS-file/component-css/fav-card.css'
import { API_URL, DEFAULT_AVATAR, FONTEND_URL } from '../env';




export default function FavoriteCard({ data }) {

    return <>
        <div className="favoriteCard" onClick={() => window.location.href = `${FONTEND_URL}/shop/${data.seller.storeName}`}>
            <img className="favoriteShopPic" src = {data.seller?.storePicture? `${API_URL}/sellerprofilepic/${data.seller.storePicture}` : DEFAULT_AVATAR } alt = 'shop'/>
            <div className="favoriteShopName">{data.seller?.storeName}</div>
            <div className='favoriteShopSellCount'> <FontAwesomeIcon icon={faCircleCheck} style={{color: "yellowgreen"}}/>&nbsp;{data.seller?.totalSellCount}</div>
            <div className='favoriteShopMessage'>
                {data?.seller?.welcomeMessage?.length > 43 ? data?.seller?.welcomeMessage?.slice(0,42) + '...' : data?.seller?.welcomeMessage}
            </div>
        </div>
    </>
}