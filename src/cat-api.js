import { Loading } from 'notiflix/build/notiflix-loading-aio';
import axios from 'axios';
import { getRefs } from './references';

const PATH_TO_BREEDS = 'https://api.thecatapi.com/v1/breeds';
const PATH_TO_CATS = 'https://api.thecatapi.com/v1/images/search';
const API_KEY =
  'live_7Rf9BcnV4i4eiKBKMRakzNS7eOxCRIr6NvazIqIVZLnkU9rzsTENVPFHOqFo0RIU';

axios.defaults.headers.common['x-api-key'] = API_KEY;

const refs = getRefs();

function fetchBreeds() {
  Loading.dots(refs.loader.textContent);
  return axios(PATH_TO_BREEDS).then(response => {
    return response.data;
  });
}

function fetchCatByBreed(breedId) {
  Loading.dots(refs.loader.textContent);
  return axios(PATH_TO_CATS, {
    params: {
      breed_ids: breedId,
    },
  }).then(response => {
    return response.data;
  });
}

export { fetchBreeds, fetchCatByBreed };
