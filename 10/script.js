const buttonOpeningModalRegister = document.querySelector(".j-register-button");
const modalRegister = document.querySelector(".j-modal-register");
const buttonCloseModalRegister = document.querySelector(".j-close-modal-register");
const loaderRegister = modalRegister.querySelector(".loader_js");
const registerForm = document.forms.registerForm;

const buttonOpeningModalLogin = document.querySelector(".j-login-button");
const modalLogin = document.querySelector(".j-modal-login");
const buttonCloseModalLogin = document.querySelector(".j-close-modal-login");
const loginForm = document.forms.loginForm;

const linkToProfile = document.querySelector(".j-to-profile");

// Логика регистрации пользователя
let isLoading = false;
function register(e) {
  e.preventDefault();
  if(isLoading) {
    return;
  }
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

buttonOpeningModalRegister.addEventListener('click', () => {
  interactionModal(modalRegister);
});
buttonCloseModalRegister.addEventListener('click', () => {
  interactionModal(modalRegister);
});
buttonCloseModalLogin.addEventListener('click', () => {
  interactionModal(modalLogin);
});

registerForm.addEventListener('submit', (e) => {
  register(e);
});
loginForm.addEventListener('submit', (e) => {
  logIn(e);
});