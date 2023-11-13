import { useParams } from "react-router-dom";
import sleepcat from "../localImage/sleep-cat.jpeg";
import notfoundCat from "../localImage/cat-404.jpeg";
import stunCat from "../localImage/stun-cat.jpeg";
import angryCat from "../localImage/angry-cat.jpeg"
import "../CSS-file/page-css/error.css";




export default function ErrorPage() {
    const { code, msg } = useParams();

    document.title = `Error ${code}`

    return <>
        <div className='error-page'>
            <div className="error-content">
                {code === 'network' && 
                <>
                    <img className="error-img" src={sleepcat} alt='error'/>
                    <div className="error-message">NETWORK ERROR ZZZ...</div>
                </>
                }
                {code === '404' && 
                <>
                    <img className="error-img" src={notfoundCat} alt='error'/>
                    <div className="error-message">NOT FOUND...</div>
                </>
                }
                {code === '500' && 
                <>
                    <img className="error-img" src={stunCat} alt='error'/>
                    <div className="error-message">500  INTERNAL SERVER ERROR...</div>
                </>
                }
                {code === '403' && 
                <>
                    <img className="error-img" src={angryCat} alt='error'/>
                    <div className="error-message">403 FORBIDDEN... {msg? msg : ''}</div>
                </>
                }
                {code !== '403' && code !== '500' && code !== '404' && code !== 'network' &&
                <>
                    <img className="error-img" src={stunCat} alt='error'/>
                    <div className="error-message">ERROR STATUS CODE: {code}</div>
                </>
                }
            </div>
        </div>
    </>
}