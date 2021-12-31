import './style.css'

const main = () => {
  const outerContainer = document.querySelector('.outer-container');
  const innerContainer = document.querySelector('.inner-container');

  let scale = 2;
  let mousedown = false;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  const getOuterRect = () => {
    return outerContainer.getBoundingClientRect();
  };

  const getInnerRect = () => {
    return innerContainer.getBoundingClientRect();
  };

  const determineDirectionX = (newX) => {
    if (newX > startX ) {
      return 'right';
    } else if (newX < startX) {
      return 'left';
    } else {
      return 'nochange';
    }
  };

  const determineDirectionY = (newY) => {
    if (newY > startY ) {
      return 'down';
    } else if (newY < startY) {
      return 'up';
    } else {
      return 'nochange';
    }
  };

  const mousedownHandler = (event) => {
    event.preventDefault();
    mousedown = true;
    startX = event.offsetX;
    startY = event.offsetY;
  };

  const mouseupHandler = (event) => {
    event.preventDefault();
    mousedown = false;
    startX = 0;
    startY = 0;
  };

  const mousemoveHandler = (event) => {
    event.preventDefault();
    if (mousedown) {
      window.requestAnimationFrame(() => {
        const outerRect = getOuterRect();
        const innerRect = getInnerRect();
        const newX = event.offsetX;
        const newY = event.offsetY;
        const xDir = determineDirectionX(newX);
        const yDir = determineDirectionY(newY);

        if (
          (!(outerRect.x < innerRect.x) && xDir === 'right') ||
          (!((innerRect.x + innerRect.width) < (outerRect.width + outerRect.x)) && xDir === 'left')
        ) {
          offsetX = offsetX + (newX - startX);
          startX = newX;
        }

        if (
          (!(outerRect.y < innerRect.y) && yDir === 'down') ||
          (!((innerRect.y + innerRect.height) < (outerRect.height + outerRect.y)) && yDir === 'up')
        ) {
          offsetY = offsetY + (newY - startY);
          startY = newY;
        }

        updateTransformation();
      });
    }
  };

  const wheelHandler = (event) => {
    event.preventDefault();
    const newScale = scale - (event.deltaY * 0.001);
    if (newScale > 0) {
      scale = newScale;
      updateTransformation();
    }
  };

  const updateTransformation = () => {
    innerContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  innerContainer.addEventListener('mousedown', mousedownHandler);
  innerContainer.addEventListener('mouseup', mouseupHandler);
  innerContainer.addEventListener('mouseout', mouseupHandler);
  innerContainer.addEventListener('mousemove', mousemoveHandler);
  innerContainer.addEventListener('wheel', wheelHandler);

  updateTransformation();
};

window.onload = main;

document.querySelector('#app').innerHTML = `
  <div class="outer-container">
    <div class="inner-container">
      <div id="first" class="zoomable">
        <div>First</div>
      </div>
      <div id="second" class="zoomable">
        <div>Second</div>
      </div>
      <div id="third" class="zoomable">
        <div>Third</div>
      </div>
      <div id="fourth" class="not-zoomable">
        <div>Fourth</div>
      </div>
    </div>
  </div>
`
