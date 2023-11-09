
import { toast } from "react-toastify";
import { FONTEND_URL } from "../env";
import localStorage from "../tokenCheck/localStorage"

export const handleErr = (err) => {
    const status = localStorage.getStatus();
    
    if(err?.response) {
        if(err.response.status === 401) {
            localStorage.removeToken();
            switch(status) {
                case 'user':
                    window.location.replace(`${FONTEND_URL}/login`);
                    break;
                case 'seller':
                    window.location.replace(`${FONTEND_URL}/seller`);
                    break;
                case 'admin':
                    window.location.replace(`${FONTEND_URL}/admin`);
                    break;
                default:
                    window.location.replace(`${FONTEND_URL}/login`);
                    break;
            }

        } else if(err.response.status === 400) {
            toast.error(err.response.data.message, {
                position: 'top-center',
                autoClose: 2000
            });

        } else if(err.response.status === 404) {
            window.location.replace(`${FONTEND_URL}/error/404`);

        } else if(err.response.status === 500) {
            window.location.replace(`${FONTEND_URL}/error/500`);
        } else {
            window.location.replace(`${FONTEND_URL}/error/${err.response.status}`);
        }
    } else {
        window.location.replace(`${FONTEND_URL}/error/network`);
    }
}