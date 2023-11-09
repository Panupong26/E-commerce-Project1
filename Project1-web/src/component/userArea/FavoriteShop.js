import '../../CSS-file/component-css/user-fav.css';
import { useContext, useEffect, useState } from "react";
import FavoriteCard from '../../component/FavoriteCard';
import { authContext } from '../../context/AuthContextProvider';

function FavoriteShop() {
    const { authUser } = useContext(authContext);
    const [favoriteData, setFavoriteData] = useState();


    useEffect(() => {
        document.title = 'My Favorite Store';
    }, [])

    useEffect(() => {
        if(authUser) {
            setFavoriteData([...authUser.favorites]);
        }
    }, [authUser])


    return <>
        <div className="favoritePage">
            {favoriteData?.map(e => <div key={e.id}><FavoriteCard data = {e}/></div>)}
        </div>
    </>   
}

export default FavoriteShop