const wrapper = document.querySelector('.slider__wrapper_js');
const innerWrapper = wrapper.querySelector('.slider__inner-wrapper_js');
const slides = innerWrapper.querySelectorAll('.slider__slide_js');
const buttonBack = document.querySelector('.slider__button-back_js');
const buttonNext = document.querySelector('.slider__button-next_js');
const paginationBox = document.querySelector('.slider__pagination_js');

const timeAnimation = 500;
const maxIndex = slides.length - 1;
let width = wrapper.clientWidth;
let activeIndex = 0;
let dots = [];
let timer = null;
let isTouch = false;
let position = {x: 0, y: 0};
let newPosition = {x: 0, y: 0};

wrapper.addEventListener('touchstart', (e) => {
  if(e.touches.length !== 1) {
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
  if(!isTouch) {
    return;
  }
  if(e.touches.length !== 1) {
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
  if(!isTouch) {
    return;
  }
  isTouch = false;
  if(position.x - newPosition.x > 100) {
    setActiveSlide(activeIndex + 1);
  }
  if(position.x - newPosition.x < -100) {
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
  if(!isTouch) {
    return;
  }
  isTouch = false;
  if(position.x - e.offsetX > 100) {
    setActiveSlide(activeIndex + 1);
  }
  if(position.x - e.offsetX < -100) {
    setActiveSlide(activeIndex - 1);
  }
});

wrapper.addEventListener('mouseup', (e) => {
  if(!isTouch) {
    return;
  }
  isTouch = false;
  if(position.x - e.offsetX > 100) {
    setActiveSlide(activeIndex + 1);
  }
  if(position.x - e.offsetX < -100) {
    setActiveSlide(activeIndex - 1);
  }
});


for(let index = 0; index < slides.length; index++) {
  let dot = createDot(index === activeIndex);
  dots.push(dot);
  dot.addEventListener('click', () => {
    setActiveSlide(index);
  });
  paginationBox.insertAdjacentElement('beforeend', dot);
}

function initWidthSlides() {
  width = wrapper.clientWidth;
  for(let slide of slides) {
    slide.style.width = `${width}px`;
  }
}
initWidthSlides();

function setActiveSlide(index, withAnimation = true) {
  if(index < 0) {
    return;
  }
  if(index > maxIndex) {
    return;
  }
  setDisableButton(buttonNext);
  setDisableButton(buttonBack);

  innerWrapper.style.transform = `translateX(${index * width * (-1)}px)`;
  if(withAnimation) {
    innerWrapper.style.transition = `transform ${timeAnimation}ms`;
    clearTimeout(timer);
    timer = setTimeout(() => {
      innerWrapper.style.transition = ``;
    }, timeAnimation);
  }


  dots[activeIndex].classList.remove('slider__dot_active');
  dots[index].classList.add('slider__dot_active');
  if(index !== 0) {
    setDisableButton(buttonBack, false);
  }
  if(index !== maxIndex) {
    setDisableButton(buttonNext, false);
  }
  activeIndex = index;
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
  if(isActive) {
    dot.classList.add(`slider__dot_active`);
  }
  return dot;
}

function setDisableButton(button, disable = true) {
  if(disable) {
    button.setAttribute('disabled', '');
  } else {
    button.removeAttribute('disabled');
  }
}


const swiper = new Swiper('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  slidesPerView: 2,

  breakpoints: {
    720: {
      slidesPerView: 1,
    },
  }
});