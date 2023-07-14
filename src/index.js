import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_7Rf9BcnV4i4eiKBKMRakzNS7eOxCRIr6NvazIqIVZLnkU9rzsTENVPFHOqFo0RIU';

const refs = {
  selector: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
  catInfo: document.querySelector('.cat-info'),
};

// const API_KEY =
//   'live_7Rf9BcnV4i4eiKBKMRakzNS7eOxCRIr6NvazIqIVZLnkU9rzsTENVPFHOqFo0RIU';
// const PATH_TO_BREEDS = 'https://api.thecatapi.com/v1/breeds';
// const PATH_TO_CATS = 'https://api.thecatapi.com/v1/images/search';
// const headers = { 'x-api-key': API_KEY };

refs.selector.addEventListener('change', onSelect);

fetchBreeds().then(fillSelector).catch(onError);

function fetchBreeds() {
  return axios('https://api.thecatapi.com/v1/breeds123').then(response => {
    return response.data;
  });
}

function fetchCatByBreed(breedId) {
  return axios('https://api.thecatapi.com/v1/images/search', {
    params: {
      breed_ids: breedId,
    },
  }).then(response => {
    return response.data;
  });
}

function fillSelector(cats) {
  const markup = cats
    .map(cat => {
      return `<option value=${cat.id}>${cat.name}</option>`;
    })
    .join('');
  refs.selector.innerHTML = markup;
}

function onSelect(evt) {
  const id = evt.target.selectedIndex;
  const breedId = evt.target[id].value;
  fetchCatByBreed(breedId).then(renderCatInfo).catch(onError);
}

function renderCatInfo(cat) {
  const markup = `<div><img src="${cat[0].url}" alt="${cat[0].breeds[0].name}" width="50 vw"></div>
  <div>
    <h2>${cat[0].breeds[0].name}</h2>
    <p>${cat[0].breeds[0].description}</p>
    <p><b>Temperament: </b>${cat[0].breeds[0].temperament}</p>
  </div>`;
  refs.catInfo.innerHTML = markup;
}

function onError(error) {
  Notify.failure(refs.error.textContent, {
    clickToClose: true,
  });
  console.log('Error', error.message);
}
