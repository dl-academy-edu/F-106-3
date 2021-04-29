const URL_SERVER = 'https://academy.directlinedev.com';
const LIMIT = 10;

(function () {
  const form = document.querySelector('.form_js');
  let box = document.querySelector('.tag-box_js');
  box.innerHTML = spinerCreate();
  getTagsFromServer({
    onload: response => {
      if (!response.success) {
        return alert('Что-то пошло не так!');
      }
      const tags = response.data;
      box.innerHTML = '';
      for (let tag of tags) {
        box.innerHTML += tagCreate(tag);
      }
      const data = getDataFromURL();
      setDataToForm(form, data);
      getPosts({onload: () => null, data});
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getDataFromForm(form);
    setDataToURL(data);
    getPosts({
      onload: () => {

      }, data
    });
  });

  const linksBox = document.querySelector('.pagination_js');
  const links = linksBox.querySelectorAll('.link_js');
  links.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO: Posts - Find 
      const data = getDataFromForm(form);
      setDataToURL({ ...data, page: index });

      getPosts({
        onload: () => {

        }, data: { ...data, page: index }
      });
    })
  })
  
})();

function linkCreateElement(index, data) {
  const a = document.createElement('a');
  a.href = 'page='+index;
  a.innerText = `Страница№ ${index+1}`
  a.addEventListener('click', (e) => {
    e.preventDefault();
      setDataToURL({ ...data, page: index });

      getPosts({
        onload: () => {

        }, data: { ...data, page: index }
      });
  });
  return a;
}

function getPosts({ onload, data }) {
  const postsBox = document.querySelector('.result_js');
  postsBox.innerHTML = spinerCreate();
  getPostFromServer({
    params: data,
    onload: response => {
      if (!response.success) {
        return alert('Что-то пошло не так!');
      }
      const posts = response.data;
      postsBox.innerHTML = '';
      for (let post of posts) {
        postsBox.innerHTML += postCreate(post);
      }
      const linksBox = document.querySelector('.pagination_js');
      let count = response.count;
      let index = 0;
      linksBox.innerHTML = '';
      while(count - LIMIT > 0) {
        linksBox.insertAdjacentElement('beforeend', linkCreateElement(index, data));
        index++;
        count -= LIMIT;
      }
      linksBox.insertAdjacentElement('beforeend', linkCreateElement(index, data));
      onload();
    }
  });
}

function getPostFromServer({ onload, params = {} }) {
  let xhr = new XMLHttpRequest();
  let serchParams = new URLSearchParams();
  serchParams.set('v', '1.0.0');
  if (params.tags && Array.isArray(params.tags)) {
    serchParams.append('tags', `[${params.tags}]`);
  }
  let filter = {};
  if (params.views) {
    filter.views = {
      $between: params.views.split('-'),
    };
  }
  if (params.name) {
    filter.title = params.name;
  }


  serchParams.set('filter', JSON.stringify(filter));
  serchParams.set('sort', JSON.stringify(['id', 'ASC']));
  if (params.page) {
    serchParams.set('limit', LIMIT);
    serchParams.set('offset', params.page * LIMIT);
  }
  xhr.open('GET', `${URL_SERVER}/api/posts?${serchParams.toString()}`);
  xhr.send();
  xhr.onload = () => {
    onload(JSON.parse(xhr.response));
  };
  xhr.onerror = () => {
    onload({ success: false, data: [] });
  };
}

function getTagsFromServer({ onload }) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `${URL_SERVER}/api/tags`);
  xhr.send();
  xhr.onload = () => {
    onload(JSON.parse(xhr.response));
  };
  xhr.onerror = () => {
    onload({ success: false, data: [] });
  };
}


function postCreate(post) {
  return `<div class="col-4 mb-3"><div class="card">
  <img src="${URL_SERVER}${post.photo.desktopPhotoUrl}" class="card-img-top" alt="">
  <div class="card-body">
    <h5 class="card-title">${post.title}</h5>
    <p class="card-text">${post.text}</p>
    ${post.tags.map(item => item.name).join(', ')}
  </div>
</div></div>`
}

function spinerCreate() {
  return `<div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>`;
}

function tagCreate(tag) {
  return `<div class="form-group form-check">
  <input name="tags" type="checkbox" class="form-check-input" id="exampleCheck${tag.id}" value="${tag.id}">
  <label style="color: ${tag.color}" class="form-check-label" for="exampleCheck${tag.id}">${tag.name}</label>
</div>`
}


function setDataToURL(data) {
  let url = new URL(window.location.origin);
  let params = url.searchParams;
  if (data.views) {
    params.set('views', data.views);
  }
  if (data.name) {
    params.set('name', data.name);
  }
  if (data.page) {
    params.set('page', data.page);
  } else {
    params.set('page', 0);
  }
  if (data.tags && Array.isArray(data.tags)) {
    data.tags.forEach(item => {
      params.append('tags', item);
    });
  }
  window.history.replaceState({}, document.title, url.search);
}

function getDataFromURL() {
  let data = {};
  const url = new URL(window.location);
  const params = url.searchParams;
  if (params.get('option')) {
    data.option = params.get('option');
  }
  if (params.get('name')) {
    data.name = params.get('name');
  }
  if (params.get('page')) {
    data.page = +params.get('page');
  } else {
    data.page = 0;
  }
  if (params.getAll('tags').length) {
    data.tags = params.getAll('tags');
  }
  return data;
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

function getStringFromDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
