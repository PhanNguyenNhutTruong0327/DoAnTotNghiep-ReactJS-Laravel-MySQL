import axios from "axios";

const httpAxios = axios.create({
  baseURL: 'http://localhost/apiDoAn/public/api/',
  timeout: 2147483647,
  headers: { 'X-Custom-Header': 'foobar' }
});

export default httpAxios;