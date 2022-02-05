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
    this.containerRect = this.e.parentElement.getBoundingClientRect();
  }

  registerEventListeners() {
    this.e.addEventListener('wheel', this.wheelHandler.bind(this));
    this.e.addEventListener('mousedown', this.mousedownHandler.bind(this))
    this.e.addEventListener('mouseup', this.mouseupHandler.bind(this));
    this.e.addEventListener('mouseout', this.mouseoutHandler.bind(this));
    this.e.addEventListener('mousemove', this.mousemoveHandler.bind(this));
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
