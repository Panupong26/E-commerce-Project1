export const registerValidate = (email, username, password, confirmPassword, status) => {
    const err = {};
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;

    console.log(email, username, password, confirmPassword, status);
    
    if(!(re.test(email))) {
        err.email = 'Please enter a valid email address.';
    } else if(!email) {
        err.email = 'Please enter your email address.';
    }

    if(status === 'admin') {
        if(!username){
            err.username = 'Please enter your username.';
        } else if(username.includes(' ')) {
            err.username = 'username cannot contain spaces.';
        } else if( !(`${+username}` === 'NaN')) {
            err.username = 'Username cannot contain only numbers.';
        } 
    }


    if(password === '') {
        err.password = 'Please enter your password';
    } else if(!(/^[a-zA-Z0-9]{6,30}$/.test(password))) {
        err.password = 'Password must contain only letters or numbers and must be at least 6 characters long.';
    } 

    if(confirmPassword !== password) {
        err.confirmPassword = 'Password and confirm password does not match.';
    } else if(confirmPassword === '') {
        err.confirmPassword = 'Confirm password is required.';
    }

    if(Object.keys(err).length === 0) {
        return
    } else {
        return err 
    }
}

export const loginValidate = (email, username, password, status) => {
    const err = {} ;

    if(status !== 'admin') {
        if(!email) {
            err.email = 'Please enter your email address.';
        }
    }
   
    
    if(status === 'admin') {
        if(!username) {
            err.username = 'Please enter your username';
        }  
    }

    if(!password) {
        err.password = 'Please enter your password';
    }

    if(Object.keys(err).length === 0) {
        return
    } else {
        return err 
    }
}

export const resetValidate = (password, confirmPassword) => {
    const err = {} ;
   
    if(!password) {
        err.password = 'Please enter your password';
    } else if(!(/^[a-zA-Z0-9]{6,30}$/.test(password))) {
        err.password = 'Password must contain only letters or numbers and must be at least 6 characters long.';
    } 

    if(confirmPassword !== password) {
        err.confirmPassword = 'Password and confirm password does not match.';
    } else if(!confirmPassword) {
        err.confirmPassword = 'Confirm password is required.';
    }

    if(Object.keys(err).length === 0) {
        return
    } else {
        return err 
    }
}

