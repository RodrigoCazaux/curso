import API_URL from "./api.config";
import axios from "axios";

async function apiGet(url) {
  const config = {
    method: "get",
    mode: "cors",
    headers: {
      "Acces-Control-Allow-Origin": "*",
    },
  };
  const urlCall = API_URL + url
  try {
    const response = await axios.get(urlCall, config);
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function apiPost(url, payload) {
  const config = {
    method: 'get',
    mode: 'cors',
    headers: {
      'Acces-Control-Allow-Origin': '*',
    },
    body: payload
  }
  const urlCall = API_URL + url
  try {
    const response = await axios.post(urlCall, config);
    console.log(response)
    return response;
  } catch (error) {
    console.log(error)
  }
}

const api = {};
api.getRestaurants = () => {
    return apiGet('restaurants');
}
api.postSubscribeUser = payload => {
  return apiPost('users', payload)
}
api.getRestaurantsByCategory = ({category}) => {
  return apiGet('restaurants?category=' + category);
}
api.getOneRestaurant = ({slug}) => {
  return apiGet('restaurants?slug=' + slug);
}
export default api;
