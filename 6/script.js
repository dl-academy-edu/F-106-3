function getFormData(form) {
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

  for(let textarea of textareas) {
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

function emailCheck(email) {
  return email.match(/^[0-9a-z-\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i);
}

(function () {
  const form = document.forms['signUp'];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getFormData(form);
    let error = {};
    if(!data.email) {
      error.email = 'Поле является обязательным!';
    }
    if(data.email && !emailCheck(data.email)) {
      error.email = 'В почте допущена ошибка!';
    }
    if(!data.password) {
      error.password = 'Поле является обязательным!';
    }
    if(data.password && data.password.length < 8) {
      error.password = 'Пароль слишком короткий!';
    }
    if(data.password && data.password.includes('123')) {
      error.password = 'Пароль слишком простой!';
    }
    
    if(data.accept !== 'yes') {
      error.accept = 'Вы не приняли условия!';
    }
    setErrorsToForm(form, error);
    console.log(error);
  })
  console.log(form);
})();