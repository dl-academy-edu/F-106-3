// Функция открытия/закрытия модального окна
function interactionModal(modal) {
  modal.classList.toggle('hidden');
}

// Ссылка на бек
const BASE_SERBER_PATH = 'https://academy.directlinedev.com';

// Функция обработки серверных запросов
function sendRequest({ url, method = 'GET', headers = {}, body = null }) {
  return fetch(`${BASE_SERBER_PATH}${url}?v=1.0.0`, {
    method,
    headers,
    body,
  });
}

function getDataFromForm(form) {
  let data = {};
  const inputs = form.querySelectorAll('input');
  const textareas = form.querySelectorAll('textarea');
  for (let input of inputs) {
    switch (input.type) {
      case 'checkbox':
        if (!data[input.name]) {
          data[input.name] = [];
        }
        if (input.checked) {
          data[input.name].push(input.value);
        }
        break;
      case 'radio':
        if (input.checked) {
          data[input.name] = input.value;
        }
        break;
      case 'file':
        data[input.name] = input.files;
        break;
      default:
        data[input.name] = input.value;
    }
  }

  for (let textarea of textareas) {
    data[textarea.name] = textarea.value;
  }
  return data;
}


function setInputError(input, error) {
  const message = document.createElement('div');

  message.classList.add('invalid-feedback');
  input.classList.add("is-invalid");

  message.innerText = error;
  input.insertAdjacentElement('afterend', message);
  input.addEventListener('input', () => {
    message.remove();
    input.classList.remove("is-invalid");
  });
}

function setCheckboxError(input, error) {
  input.classList.add("is-invalid");
  const container = input.parentElement.parentElement;

  const invalidFeedback = container.querySelector('.invalid-feedback');
  if(invalidFeedback) {
    invalidFeedback.innerText = error;
    input.addEventListener('change', () => {
      invalidFeedback.remove();
      const inputs = container.querySelectorAll('input');
      for(let input of inputs) {
        input.classList.remove("is-invalid");
      }
    });
    return;
  }

  const message = document.createElement('div');

  message.classList.add('invalid-feedback');
  message.style = 'display: block;';

  message.innerText = error;
  container.insertAdjacentElement('beforeend', message);
  input.addEventListener('change', () => {
    message.remove();
    input.classList.remove("is-invalid");
  });
}

function setErrorsToForm(form, errors) {
  const inputs = form.querySelectorAll('input');
  const textareas = form.querySelectorAll('textarea');

  for (let input of inputs) {
    switch (input.type) {
      case 'checkbox':
        if(errors[input.name]) {
          setCheckboxError(input, errors[input.name])
        }
        break;
      case 'radio':
        if(errors[input.name]) {
          setCheckboxError(input, errors[input.name])
        }
        break;
      default:
        if(errors[input.name]) {
          setInputError(input, errors[input.name]);
        }
    }
  }
}