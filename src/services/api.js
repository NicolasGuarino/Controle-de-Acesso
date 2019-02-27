import axios from 'axios';

// const baseUrl = 'http://192.168.1.153:3000/portaria'; //API NODE
const imgUrl = 'http://www.nuflame.com.br/portaria';
const baseUrl = 'http://www.nuflame.com.br/portaria';

const cancelToken = axios.CancelToken;

const api = axios.create({
    baseURL: baseUrl + '/api'
});

export { baseUrl, imgUrl, cancelToken };
export default api;
