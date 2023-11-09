
const setToken = (token, status) => {
    localStorage.setItem('ACCESS_TOKEN', token);
    localStorage.setItem('STATUS', status);
}

const getToken = () => {
    return localStorage.getItem('ACCESS_TOKEN');
}

const removeToken = () => {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('STATUS');
}

const getStatus = () => {
    if(localStorage.getItem('ACCESS_TOKEN')) {
        return localStorage.getItem('STATUS')
    } else {
        return 'guest'
    }
}

const object = {
    setToken,
    getToken,
    removeToken,
    getStatus
}

export default  object ;

