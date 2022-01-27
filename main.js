import './style.css'

const MAGNIFICATION_CONSTANT = 0.001;

class Container {
  constructor(element) {
    this.e = element;
  }

  get rect() {
    return this.e.getBoundingClientRect();
  }
}

class OuterContainer extends Container {
  constructor(element) {
    super(element);
  }

}

class InnerContainer extends Container {

  constructor(element) {
    super(element);
    this.initialize();
    this.registerEventListeners();
    this.update();
  }

  initialize() {
    this.scale = 2.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.mousedown = false;
    this.refRect = this.rect;
    this.containerRect = this.e.parentElement.getBoundingClientRect();
  }

  registerEventListeners() {
    this.e.addEventListener('wheel', this.wheelHandler.bind(this));
    this.e.addEventListener('mousedown', this.mousedownHandler.bind(this))
    this.e.addEventListener('mouseup', this.mouseupHandler.bind(this));
    this.e.addEventListener('mouseout', this.mouseoutHandler.bind(this));
    this.e.addEventListener('mousemove', this.mousemoveHandler.bind(this));
    this.e.addEventListener('transitionend', this.transitionendHandler.bind(this));
  }

  transitionendHandler(event) {
    this.refRect = this.rect;
  }

  wheelHandler(event) {
    event.preventDefault();
    const newScale = this.scale - (event.deltaY * MAGNIFICATION_CONSTANT);
    if (newScale > 0) {
      this.scale = newScale;
      this.update();
      this.refRect = this.rect;
    }
  }

  mousedownHandler(event) {
    event.preventDefault();
    this.mousedown = true;
  }

  mouseupHandler(event) {
    event.preventDefault();
    this.mousedown = false;
  }

  mouseoutHandler(event) {
    event.preventDefault();
    this.mousedown = false;
  }

  mousemoveHandler(event) {
    event.preventDefault();
    if (this.mousedown) {
      let {movementX, movementY} = event;
      console.log('--------------');
      console.log(movementX + ' ' + movementY);
      console.log(this.containerRect.x + ' ' + this.containerRect.y);
      console.log(this.refRect.x + ' ' + this.refRect.y);
      this.offsetX += movementX;
      this.offsetY += movementY;
      this.update();
    }
  }

  update() {
    this.e.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
  }

}

const main = () => {
  const outerContainer = new OuterContainer(document.querySelector('.outer-container'));
  const innerContainer = new InnerContainer(document.querySelector('.inner-container'));

  const VERTICAL_DIR = {
    UP: 'UP',
    DOWN: 'DOWN',
    NOCHANGE: 'NOCHANGE'
  };

  const HORIZONTAL_DIR = {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    NOCHANGE: 'NOCHANGE'
  };

  let scale = 2;
  let mousedown = false;
  let offsetX = 0;
  let offsetY = 0;
  let startX = 0;
  let startY = 0;

  const determineHDirection = (newX) => {
    if (newX > startX ) {
      return HORIZONTAL_DIR.RIGHT;
    } else if (newX < startX) {
      return HORIZONTAL_DIR.LEFT;
    } else {
      return HORIZONTAL_DIR.NOCHANGE;
    }
  };

  const determineVDirection = (newY) => {
    if (newY > startY ) {
      return VERTICAL_DIR.DOWN;
    } else if (newY < startY) {
      return VERTICAL_DIR.UP;
    } else {
      return VERTICAL_DIR.UP;
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
        const outerRect = outerContainer.rect;
        const innerRect = innerContainer.rect;
        const newX = event.offsetX;
        const newY = event.offsetY;
        const xDir = determineHDirection(newX);
        const yDir = determineVDirection(newY);

        if (
          (!(outerRect.x < innerRect.x) && xDir === HORIZONTAL_DIR.RIGHT) ||
          (!((innerRect.x + innerRect.width) < (outerRect.width + outerRect.x)) && xDir === HORIZONTAL_DIR.LEFT)
        ) {
          let offsetAddendum = newX - startX;
          if (offsetAddendum > outerRect.x) {
            offsetAddendum = outerRect.x;
          }
          offsetX = offsetX + offsetAddendum;
          startX = newX;
        }

        if (
          (!(outerRect.y < innerRect.y) && yDir === VERTICAL_DIR.DOWN) ||
          (!((innerRect.y + innerRect.height) < (outerRect.height + outerRect.y)) && yDir === VERTICAL_DIR.UP)
        ) {
          offsetY = offsetY + (newY - startY);
          startY = newY;
        }

        updateTransformation();
    }
  };

  const wheelHandler = (event) => {
    event.preventDefault();
    const newScale = scale - (event.deltaY * MAGNIFICATION_CONSTANT);
    if (newScale > 0) {
      scale = newScale;
      updateTransformation();
    }
  };

  const updateTransformation = () => {
    innerContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  }

  // innerContainer.addEventListener('mousedown', mousedownHandler);
  // innerContainer.addEventListener('mouseup', mouseupHandler);
  // innerContainer.addEventListener('mouseout', mouseupHandler);
  // innerContainer.addEventListener('mousemove', mousemoveHandler);
  // outerContainer.addEventListener('wheel', wheelHandler);

  // updateTransformation();
};

window.onload = main;

document.querySelector('#app').innerHTML = `
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
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
      <div id="fifth" class="zoomable">
        <div>Fifth</div>
      </div>
      <div id="sixth" class="zoomable">
        <div>Sixth</div>
      </div>
      <div id="seventh" class="zoomable">
        <div>Seventh</div>
      </div>
    </div>
  </div>
`
