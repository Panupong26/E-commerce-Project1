

const registerValidator = (email, username, password, status) => {
    const err = {};
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
    
    if(!(re.test(email)) || !email) {
        err.email = 'Invalid email address.';
    }

    if(status === 'admin') {
        if(!username || username.includes(' ') || !(`${+username}` === 'NaN')){
            err.username = 'Invalid username.';
        }
    }

    if(!password || !(/^[a-zA-Z0-9]{6,30}$/.test(password))) {
        err.password = 'Invalid password.';
    } 

    if(Object.keys(err).length === 0) {
        return
    } else {
        return err 
    }
}

const userValidator = (name, phoneNumber, bankAccountNumber) => {
    const err = {};
  
    if(name && (!(/^[a-zA-Z0-9]{0,30}$/.test(name)) || `${+name}` !== 'NaN')) {
        err.password = 'Invalid name.';
    } 

    if(phoneNumber && !(/^[0-9]{10}$/.test(phoneNumber))) {
        err.phoneNumber = 'Invalid phoneNumber.';
    }

    if(bankAccountNumber && !(/^[0-9]{10,12}$/.test(bankAccountNumber))) {
        err.bankAccountNumber = 'bankAccountNumber';
    }

    if(Object.keys(err).length === 0) {
        return
    } else {
        return err 
    }
}

const productValidator = (optionPrice, sentPrice, sentAmount) => {
    const err = {};

    if(!optionPrice || `${+optionPrice}` === 'NaN') {
        err.optionPrice = 'Invalid value' ;
    }


    if(!sentPrice || `${+sentPrice}` === 'NaN') {
        err.sentPrice = 'Invalid value' ;
    }


    if(!sentAmount || `${+sentAmount}` === 'NaN') {
        err.sentAmount = 'Invalid value' ;
    }

    if(Object.keys(err).length === 0) {
        return
    } else {
        return err 
    }
}


module.exports = { 
    registerValidator,
    userValidator,
    productValidator
}