const axios = require('axios');

const username = 'TEST_MERCHANT';
const password = '123456';

getTokenFromQpay = async () => {
    return new Promise((resolve, reject) => {
        const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
        axios.post('https://merchant.qpay.mn/v2/auth/token', {}, {
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        })
        .then(async response => {
            console.log('requestInvoice Response:', response.data);
            const token = response.data.access_token
            resolve(token);
        })
        .catch(error => {
            console.error('requestInvoice Error:', error);
            reject(error);
        });
        
    });
}

module.exports = {
    getTokenFromQpay
}