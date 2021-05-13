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

const buttonLogin = document.querySelector('.j-login-button');
const buttonRegister = document.querySelector('.j-register-button');
const buttonProfile = document.querySelector('.j-to-profile');

updateTokenState();

function updateTokenState(param) {
  if (!param) {
    const token = localStorage.getItem('token');
    if (token) {
      buttonLogin.classList.add('hidden');
      buttonRegister.classList.add('hidden');
      buttonProfile.classList.remove('hidden');
    } else {
      buttonLogin.classList.remove('hidden');
      buttonRegister.classList.remove('hidden');
      buttonProfile.classList.add('hidden');
    }
  } else {
    const { token, userId } = param;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    buttonLogin.classList.add('hidden');
    buttonRegister.classList.add('hidden');
    buttonProfile.classList.remove('hidden');
  }
}

function setDataToForm(form, data) {
  const inputs = form.querySelectorAll('input');
  const textareas = form.querySelectorAll('textarea');
  for (let input of inputs) {
    switch (input.type) {
      case 'checkbox':
        if (data[input.name] && Array.isArray(data[input.name])) {
          if (data[input.name].some(item => item === input.value)) {
            input.checked = true;
          }
        }
        break;
      case 'radio':
        if (data[input.name] === input.value) {
          input.checked = true;
        }
        break;
      default:
        if (data[input.name]) {
          input.value = data[input.name];
        }
    }
  }

  for (let textarea of textareas) {
    if (data[textarea.name]) {
      textarea.value = data[textarea.name];
    }
  }
  return data;
}

function getDataFromForm(form, isFormData = false) {
  if (isFormData) {
    return new FormData(form);
  } else {
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

}
function removeErrorsFromForm(form) {
  let messages = form.querySelectorAll('.invalid-feedback');
  for(let message of messages) {
    message.remove();
  }
  let inputs = form.querySelectorAll('input.is-invalid');
  for(let input of inputs) {
    input.classList.remove("is-invalid");
  }
}

function setInputError(input, error) {
  const message = document.createElement('div');

  message.classList.add('invalid-feedback');
  input.classList.add("is-invalid");

  message.innerText = error;
  input.insertAdjacentElement('afterend', message);
  input.addEventListener('input', () => {
    console.log('input');
    message.remove();
    input.classList.remove("is-invalid");
  }, {
    once: true
  });
}

function setCheckboxError(input, error) {
  input.classList.add("is-invalid");
  const container = input.parentElement.parentElement;

  const invalidFeedback = container.querySelector('.invalid-feedback');
  if (invalidFeedback) {
    invalidFeedback.innerText = error;
    input.addEventListener('change', () => {
      invalidFeedback.remove();
      const inputs = container.querySelectorAll('input');
      for (let input of inputs) {
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
        if (errors[input.name]) {
          setCheckboxError(input, errors[input.name])
        }
        break;
      case 'radio':
        if (errors[input.name]) {
          setCheckboxError(input, errors[input.name])
        }
        break;
      default:
        if (errors[input.name]) {
          setInputError(input, errors[input.name]);
        }
    }
  }
}