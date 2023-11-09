import '../CSS-file/page-css/verification.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {useContext, useEffect, useState} from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../config/Axios';
import { loadingContext } from '../context/LoadingContextProvider';
import { handleErr } from '../handle-err/HandleErr';
import { FONTEND_URL } from '../env';


function Verification() {
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();
    const [status, setStatus] = useState();
    const [ref, setRef] = useState();
    const [isVerify, setIsVerify] = useState(false);

    const { setIsLoading } = useContext(loadingContext);



    useEffect(() => {
        document.title = 'Email Verification';
    }, [])

    useEffect(() => {
        if(searchParams) {
            setRef(searchParams.get('ref'));
        }
    }, [searchParams]);

   
    useEffect(() => {
        const getStatus = async () => {
            setIsLoading(true);

            await axios.post('/verify/getverifystatus', {ref: ref})
            .then(res => {
                setStatus(res.data);
            })
            .catch(err => {
                handleErr(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
        }
        if(ref) {
            getStatus();
        }
        // eslint-disable-next-line
    }, [ref]);


    useEffect(() => {
        async function createAdmin() {
            setIsLoading(true);

            await axios.post(`/admin/createadmin`, {ref: ref})
            .then(() => {
               setIsVerify(true);
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
        };

        async function createUser() {
            setIsLoading(true);

            await axios.post(`/user/createuser`, {ref: ref})
            .then(() => {
                setIsVerify(true);
            })
             .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
        };


        async function createSeller() {
            setIsLoading(true)
      
            await axios.post(`/seller/createseller`, {ref: ref})
            .then(() => {
                setIsVerify(true);
            })
            .catch(err => {
                handleErr(err);
            })
            .finally(() => {
                setIsLoading(false);
            })
        };


        if(status) {
            if(status === 'admin') {
                createAdmin();
            } else if(status === 'user') {
                createUser();
            } else if(status === 'seller') {
                createSeller();
            }
        }
        // eslint-disable-next-line
    }, [status, ref]);

    return (
        <div>
            <div className='verificationPage'>
                { isVerify &&
                <div className='veMsgBox'>
                    <div className='icon'><FontAwesomeIcon icon={faCircleCheck} style={{color: "#b3e548"}}/></div>
                    <div className='msg'>You have succesfully verified account</div>
                    <div className='button' onClick={() => {
                        if(status && status === 'admin') {
                            window.location.replace(`${FONTEND_URL}/admin`);
                        } else if(status && status === 'user') {
                            window.location.replace(`${FONTEND_URL}/login`);
                        } else if(status && status === 'seller') {
                            window.location.replace(`${FONTEND_URL}/seller`);
                        }
                    }}>Ok</div>
                </div>
                }       
            </div>
        </div>
    );
};

export default Verification;