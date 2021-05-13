const profileImg = document.querySelector(".j-profile-img");
const profileName = document.querySelector(".j-profile-name");
const profileSurname = document.querySelector(".j-profile-surname");
const profileEmail = document.querySelector(".j-profile-email");
const profileLocation = document.querySelector(".j-profile-location");
const profileAge = document.querySelector(".j-profile-age");

const buttonOpeningModalEditing = document.querySelector(".j-editing-button");
const modalEditing = document.querySelector(".j-modal-editing");
const buttonCloseModalEditing = document.querySelector(".j-close-modal-editing");

const editingForm = document.forms.editingForm;
let mainLoader = document.querySelector('.main-loader_js');
let isLoading = false;

function renderProfile(profile) {
  profileImg.style.backgroundImage = `url('${BASE_SERBER_PATH + profile.photoUrl}')`;

  profileName.innerHTML = profile.name;
  profileSurname.innerHTML = profile.surname;
  profileEmail.innerHTML = profile.email;
  profileLocation.innerHTML = profile.location;
  profileAge.innerHTML = profile.age;

  setDataToForm(editingForm, profile);
}

function updateProfile() {
  sendRequest({
    method: 'GET',
    url: '/api/users/' + localStorage.getItem('userId'),
  })
  .then(res => res.json())
  .then(res => {
    if(!res.success) {
      throw res;
    }
    renderProfile(res.data);
  })
  .catch(err => {
    if(err._message) {
      alert(err._message);
    }
  });
}

updateProfile();

function changeData(e) {
  e.preventDefault();
  if(isLoading) {
    return;
  }
  isLoading = true;
  mainLoader.classList.remove('hidden');
  const data = getDataFromForm(e.target, true);
  sendRequest({
    method: 'PUT',
    url: '/api/users',
    headers: {
      'x-access-token': localStorage.getItem('token'),
    },
    body: data,
  })
  .then(res => res.json())
  .then(res => {
    if(!res.success) {
      throw res;
    }
    renderProfile(res.data);
    isLoading = false;
    mainLoader.classList.add('hidden');
  })
  .catch(err => {
    if(err._message) {
      alert(err._message);
    }
    setErrorsToForm(e.target, err.errors);
    isLoading = false;
    mainLoader.classList.add('hidden');
  });
}


buttonOpeningModalEditing.addEventListener('click', () => {
  interactionModal(modalEditing)
});
buttonCloseModalEditing.addEventListener('click', () => {
  interactionModal(modalEditing)
});

modalEditing.addEventListener('submit', (e) => {
  changeData(e)
});

