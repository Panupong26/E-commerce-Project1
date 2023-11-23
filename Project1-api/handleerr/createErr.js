module.exports = (statusCode, error, from) => {
    console.log(error.message + ' FROM:' + from);
    const err = new Error('Internal server error');
    err.status = statusCode;
    return err;
}