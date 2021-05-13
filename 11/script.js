const buttonOpeningModalRegister = document.querySelector(".j-register-button");
const modalRegister = document.querySelector(".j-modal-register");
const buttonCloseModalRegister = document.querySelector(".j-close-modal-register");
const loaderRegister = modalRegister.querySelector(".loader_js");
const registerForm = document.forms.registerForm;

const loginForm = document.forms.loginForm;

const linkToProfile = document.querySelector(".j-to-profile");
const modalLogin = document.querySelector(".j-modal-login");
const loaderLogin = modalLogin.querySelector(".loader_js");

// Логика регистрации пользователя
let isLoading = false;
function register(e) {
  e.preventDefault();
  if(isLoading) {
    return;
  }
  removeErrorsFromForm(e.target);
  isLoading = true;
  loaderRegister.classList.remove('hidden');
  const data = getDataFromForm(e.target);
  console.log(data);
  sendRequest({
    url: '/api/users',
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
  .then(res => res.json())
  .then(res => {
    if(!res.success) {
      throw res;
    } else {
      console.log('then', res);
      isLoading = false;
      loaderRegister.classList.add('hidden');
    }
  })
  .catch(err => {
    setErrorsToForm(e.target, err.errors);
    isLoading = false;
    loaderRegister.classList.add('hidden');
  });
}


function logIn(e) {
  e.preventDefault();
  if(isLoading) {
    return;
  }
  removeErrorsFromForm(e.target);
  isLoading = true;
  loaderLogin.classList.remove('hidden');
  const data = getDataFromForm(e.target);
  sendRequest({
    method: 'POST',
    url: '/api/users/login',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(res => {
    if(!res.success) {
      throw res;
    }
    window.location = '/11/profile';
    updateTokenState(res.data);
    isLoading = false;
    loaderLogin.classList.add('hidden');
  })
  .catch(err => {
    if(err._message) {
      alert(err._message);
    }
    setErrorsToForm(e.target, err.errors);
    isLoading = false;
    loaderLogin.classList.add('hidden');
  });
}

function modalWindow({toggleButtonSelector, closeButtonSelector, modalSelector, isOpen = false}) {
  const toggleButton = document.querySelector(toggleButtonSelector);
  const closeButton = document.querySelector(closeButtonSelector);
  const modal = document.querySelector(modalSelector);
  
  toggleButton.addEventListener('click', () => {
    removeErrorsFromForm(modal);
    interactionModal(modal);
  });
  closeButton.addEventListener('click', () => {
    removeErrorsFromForm(modal);
    interactionModal(modal);
  });
}

modalWindow({
  toggleButtonSelector: '.j-login-button',
  closeButtonSelector: '.j-close-modal-login',
  modalSelector: '.j-modal-login',
});

modalWindow({
  toggleButtonSelector: '.j-register-button',
  closeButtonSelector: '.j-close-modal-register',
  modalSelector: '.j-modal-register',
});


registerForm.addEventListener('submit', (e) => {
  register(e);
});
loginForm.addEventListener('submit', (e) => {
  logIn(e);
});