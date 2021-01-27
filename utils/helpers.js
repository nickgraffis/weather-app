/*
* Determine if the screenSize is big or small
*/
const determineScreenSize = () => {
  if (window.innerWidth <= 800) {
    return 'small';
  } else {
    return 'big';
  }
}

/*
* Determine if theme should be dark or light
*/
const determineMood = (tod) => {
  if (tod == 'night') {
    document.body.setAttribute('data-theme', 'dark')
    document.querySelector('.sun').style.display = 'none'
    document.querySelector('.moon').style.display = 'inline-block'
  } else {
    document.body.removeAttribute('data-theme')
    document.querySelector('.sun').style.display = 'inline-block'
    document.querySelector('.moon').style.display = 'none'
  }
}
