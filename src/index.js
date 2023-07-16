import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { getRefs } from './references';
import { fetchBreeds, fetchCatByBreed } from './cat-api';

const refs = getRefs();

// const selector = new SlimSelect({
//   select: '.breed-select',
//   events: {
//     afterChange: onSelect,
//   },
// });

fetchBreeds()
  .then(fillSelector)
  .catch(onError)
  .finally(() => {
    Loading.remove;
    showElement(refs.selector);
  });

function fillSelector(cats) {
  let markup = cats.map(cat => {
    const value = cat.id;
    const text = cat.name;
    return { value, text };
  });
  markup.splice(0, 0, {
    placeholder: true,
    text: "Please choose the cat's breed",
  });
  const selector = new SlimSelect({
    select: '.breed-select',
    events: {
      afterChange: onSelect,
    },
  });
  selector.setData(markup);
}

function onSelect(option) {
  if (option[0].placeholder) {
    Loading.remove();
    return;
  }
  hideElement(refs.catInfo);
  const breedId = option[0].value;
  fetchCatByBreed(breedId)
    .then(renderCatInfo)
    .catch(onError)
    .finally(Loading.remove);
}

function renderCatInfo(cat) {
  const markup = `<div>
    <img src="${cat[0].url}" alt="${cat[0].breeds[0].name}">
  </div>
  <div>
    <h2>${cat[0].breeds[0].name}</h2>
    <p>${cat[0].breeds[0].description}</p>
    <p><b>Temperament: </b>${cat[0].breeds[0].temperament}</p>
  </div>`;
  refs.catInfo.innerHTML = markup;
  showElement(refs.catInfo);
}

function onError(error) {
  Notify.failure(refs.error.textContent, {
    clickToClose: true,
  });
  console.log('Error message: ', error);
}

function hideElement(element) {
  element.classList.add('is-hidden');
}

function showElement(element) {
  element.classList.remove('is-hidden');
}
