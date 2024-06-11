import request from '../utils/httpRequest';

export const getAddress = async (data) => {
    try {
        const res = await request.get('/addresses', data);

        return res.data;
    } catch (err) {
        if (!err.response) {
            console.log('Network error:', err.message);
            return { status: 'NETWORK_ERROR', message: err.message };
        } else {
            console.log('err.response.data', err.response);
            return err.response;
        }
    }
};

export const getTransactions = async (data) => {
    try {
        const res = await request.get('/transactions', data);

        return res.data;
    } catch (err) {
        if (!err.response) {
            console.log('Network error:', err.message);
            return { status: 'NETWORK_ERROR', message: err.message };
        } else {
            console.log('err.response.data', err.response);
            return err.response;
        }
    }
};
