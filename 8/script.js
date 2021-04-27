const MONTHS = ["Январь", "Февраль", "Март", "Апр.", "Май", "Июнь", "Июль", "Авгус", "Сентябрь", "Октябрь"];

(function () {
  let dateFromServer = '2020-04-27T15:23:24.121Z';
  let date = new Date(dateFromServer);
  // document.body.innerText = getStringFromDate(date);
  console.log(date);
})();
(function () {
  const wrapper = document.querySelector('.slider__wrapper_js');
  const innerWrapper = wrapper.querySelector('.slider__inner-wrapper_js');
  const slides = innerWrapper.querySelectorAll('.slider__slide_js');
  const buttonBack = document.querySelector('.slider__button-back_js');
  const buttonNext = document.querySelector('.slider__button-next_js');
  const paginationBox = document.querySelector('.slider__pagination_js');

  const timeAnimation = 500;
  const maxIndex = slides.length - 1;
  let width = wrapper.clientWidth;
  let activeIndex = +localStorage.getItem('index');
  let dots = [];
  let timer = null;
  let isTouch = false;
  let position = { x: 0, y: 0 };
  let newPosition = { x: 0, y: 0 };

  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) {
      isTouch = false;
    } else {
      isTouch = true;
      position = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  });
  wrapper.addEventListener('touchmove', (e) => {
    if (!isTouch) {
      return;
    }
    if (e.touches.length !== 1) {
      isTouch = false;
    } else {
      isTouch = true;
      newPosition = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  });
  window.addEventListener('touchend', (e) => {
    if (!isTouch) {
      return;
    }
    isTouch = false;
    if (position.x - newPosition.x > 100) {
      setActiveSlide(activeIndex + 1);
    }
    if (position.x - newPosition.x < -100) {
      setActiveSlide(activeIndex - 1);
    }
  });
  wrapper.addEventListener('mousedown', (e) => {
    isTouch = true;
    position = {
      y: e.offsetY,
      x: e.offsetX,
    };
  });
  wrapper.addEventListener('mouseout', (e) => {
    if (!isTouch) {
      return;
    }
    isTouch = false;
    if (position.x - e.offsetX > 100) {
      setActiveSlide(activeIndex + 1);
    }
    if (position.x - e.offsetX < -100) {
      setActiveSlide(activeIndex - 1);
    }
  });
  wrapper.addEventListener('mouseup', (e) => {
    if (!isTouch) {
      return;
    }
    isTouch = false;
    if (position.x - e.offsetX > 100) {
      setActiveSlide(activeIndex + 1);
    }
    if (position.x - e.offsetX < -100) {
      setActiveSlide(activeIndex - 1);
    }
  });


  for (let index = 0; index < slides.length; index++) {
    let dot = createDot(index === activeIndex);
    dots.push(dot);
    dot.addEventListener('click', () => {
      setActiveSlide(index);
    });
    paginationBox.insertAdjacentElement('beforeend', dot);
  }

  function initWidthSlides() {
    width = wrapper.clientWidth;
    for (let slide of slides) {
      slide.style.width = `${width}px`;
    }
  }
  initWidthSlides();

  function setActiveSlide(index, withAnimation = true) {
    if (index < 0) {
      return;
    }
    if (index > maxIndex) {
      return;
    }
    setDisableButton(buttonNext);
    setDisableButton(buttonBack);

    innerWrapper.style.transform = `translateX(${index * width * (-1)}px)`;
    if (withAnimation) {
      innerWrapper.style.transition = `transform ${timeAnimation}ms`;
      clearTimeout(timer);
      timer = setTimeout(() => {
        innerWrapper.style.transition = ``;
      }, timeAnimation);
    }


    dots[activeIndex].classList.remove('slider__dot_active');
    dots[index].classList.add('slider__dot_active');
    if (index !== 0) {
      setDisableButton(buttonBack, false);
    }
    if (index !== maxIndex) {
      setDisableButton(buttonNext, false);
    }
    activeIndex = index;
    localStorage.setItem('index', index);
  }

  buttonNext.addEventListener('click', () => {
    setActiveSlide(activeIndex + 1);
  });

  buttonBack.addEventListener('click', () => {
    setActiveSlide(activeIndex - 1);
  });

  setActiveSlide(activeIndex);

  window.addEventListener('resize', () => {
    initWidthSlides();
    setActiveSlide(activeIndex, false);
  });

  function createDot(isActive) {
    let dot = document.createElement("button");
    dot.classList.add(`slider__dot`);
    if (isActive) {
      dot.classList.add(`slider__dot_active`);
    }
    return dot;
  }

  function setDisableButton(button, disable = true) {
    if (disable) {
      button.setAttribute('disabled', '');
    } else {
      button.removeAttribute('disabled');
    }
  }
})();

(function() {
  const form = document.querySelector('.form_js');
  const data = getDataFromURL();
  setDataToForm(form, data);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getDataFromForm(form);
    setDataToURL(data);
  });
  const linksBox = document.querySelector('.pagination_js');
  const links = linksBox.querySelectorAll('.link_js');
  links.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO: Posts - Find 
      const data = getDataFromForm(form);
      setDataToURL({...data, page: index});
    })
  })
})();

const resulBox = document.querySelector('.result_js');
function setDataToURL(data) {
  let url = new URL(window.location.origin);
  let params = url.searchParams;
  if(data.option) {
    params.set('option', data.option);
  }
  if(data.name) {
    params.set('name', data.name);
  }
  if(data.page) {
    params.set('page', data.page);
  } else {
    params.set('page', 0);
  }
  if(data.selectOf && Array.isArray(data.selectOf)) {
    data.selectOf.forEach(item => {
      params.append('selectOf', item);
    });
  }
  window.history.replaceState({}, document.title, url.search);
  resulBox.innerText = JSON.stringify(data, null, 2);
}

function getDataFromURL() {
  let data = {};
  const url = new URL(window.location);
  const params = url.searchParams;
  if(params.get('option')) {
    data.option = params.get('option');
  }
  if(params.get('name')) {
    data.name = params.get('name');
  }
  if(params.get('page')) {
    data.page = +params.get('page');
  } else {
    data.page = 0;
  }
  if(params.getAll('selectOf').length) {
    data.selectOf = params.getAll('selectOf');
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
          if(data[input.name].some(item => item === input.value)) {
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
        if(data[input.name]) {
          input.value = data[input.name];
        }
    }
  }

  for(let textarea of textareas) {
    if(data[textarea.name]) {
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

  for(let textarea of textareas) {
    data[textarea.name] = textarea.value;
  }
  return data;
}

function getStringFromDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
