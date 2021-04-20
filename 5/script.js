(function() {
  const container = document.querySelector('.container_js');
  container.classList.add('container_min');
  container.classList.toggle('container_red');
  container.setAttribute('test', 'second value');
  container.style.minHeight = '100px';
  container.style.backgroundColor = 'white';
  container.innerHTML = 'test';
});

(function() {
  let ownContextMenu = event => {
    console.log(event);
  }
  
  window.addEventListener(
    "keydown",
    ownContextMenu
  );
});

(function() {
  const button = document.querySelector('.button-to-top_js');
  if(button) {
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      button.classList.add('button-to-top_hidden');
    });

    window.addEventListener('scroll', () => {
      if(window.pageYOffset > 900) {
        button.classList.remove('button-to-top_hidden');
      } else {
        button.classList.add('button-to-top_hidden');
      }
    });
  }
})();

(function() {
  const menu = document.querySelector('.contextmenu_js');
  if(!menu) {
    return;
  }
  const button = menu.querySelector('.contextmenu__button_js');

  button.addEventListener('click', () => {
    window.scrollBy({
      top: 1100,
      behavior: 'smooth',
    });
    closeMenu();
  });

  function handleScroll() {
    closeMenu();
  };

  function handleKeyDown(e) {
    if(e.keyCode === 27) {
      closeMenu();
    }
  }
  
  function handleClick(e) {
    if(!menu.contains(e.target)) {
      closeMenu();
    }
  };

  function closeMenu() {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('click', handleClick);
    window.removeEventListener('keydown', handleKeyDown);
    menu.classList.add('contextmenu_hidden');
  }

  window.addEventListener('contextmenu', e => {
    e.preventDefault();
    console.log(e);
    menu.classList.remove('contextmenu_hidden');
    menu.style.left = `${e.offsetX}px`; 
    menu.style.top = `${e.offsetY - window.pageYOffset}px`;
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
  });
})();