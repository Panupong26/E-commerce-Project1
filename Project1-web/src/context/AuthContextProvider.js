import { createContext, useEffect, useState } from "react";
import axios from "../config/Axios";
import { FONTEND_URL } from "../env";
import { handleErr } from "../handle-err/HandleErr";
import localStorage from "../tokenCheck/localStorage";

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
    const [authUser, setAuthUser] = useState();
    // eslint-disable-next-line
    const [status, setStatus] = useState(localStorage.getStatus());
    const [cartData, setCartData] = useState();
    const [notification, setNotification] = useState();

    const fetchUser = async () => {
        await axios.get('/user/getmydata')
        .then(res => {
            setAuthUser({...res.data});
        })
        .catch(err => {
            handleErr(err);
        })
    }

    const fetchSeller = async () => {
        await axios.get('/seller/getmydata')
        .then(res => {
            setAuthUser({...res.data});
        })
        .catch(err => {
            handleErr(err)
        })
    }

    const fetchAdmin = async () => {
        await axios.get('/admin/getadmin')
        .then(res => {
            setAuthUser({...res.data});
        })
        .catch(err => {
           handleErr(err);
        })
    }

    async function getCart() {
        await axios.get(`/cart/getcart`)
        .then(res => {
            setCartData([...res.data]);
        })
      };
    
      async function getNotification() {
        if(status === 'user') {
          await axios.get(`/notification/getnotificationbyuserid`)
          .then(res => {
            let data = [...res.data];
            data.sort((a, b) => b.id - a.id);
            setNotification([...data]);
          })
          .catch(() => {
            localStorage.removeToken();
            window.location.replace(`${FONTEND_URL}/login`);
          });
        } else if(status === 'seller') {
          await axios.get(`/notification/getnotificationbysellerid`)
          .then(res => {
            let data = [...res.data];
            data.sort((a, b) => b.id - a.id);
            setNotification([...data]);
          })
          .catch(err => {
            handleErr(err);
          });
        };
      };
    
      
      useEffect(() => {
        if(status) {
          if(status === 'user' && !(window.location.pathname.includes('error'))) {
            fetchUser();
            getCart();
            getNotification();
          } else if(status === 'seller' && !(window.location.pathname.includes('error'))) {
            fetchSeller();
            getNotification();
          } else if(status === 'admin' && !(window.location.pathname.includes('error'))) {
            fetchAdmin();
          }
        };
        // eslint-disable-next-line
      }, [status]);
    
      useEffect(() => {
        if(status) {
          if(status !== 'guest' && !(window.location.pathname.includes('error'))) {
            setTimeout(() => {
              getNotification();
            }, 20000);
          }
        };
        // eslint-disable-next-line
      }, [notification]);



    return <authContext.Provider value={{authUser, status, cartData, setCartData, notification}}>{children}</authContext.Provider>
}