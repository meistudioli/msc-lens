import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

const borderRadius = 16;
const transitionDuration = 300;
const defaults = {
  sensorsize: 28, //px
  active: false,
  delay: 500,
  format: 'blob', // blob or dataURL
  webservice: {
    uri: '',
    fieldName: 'lens',
    params: {}
  }
};

const booleanAttrs = ['active'];
const objectAttrs = ['webservice'];
const custumEvents = {
  switch: 'msc-lens-switch',
  capture: 'msc-lens-capture',
  process: 'msc-lens-process',
  result: 'msc-lens-result'
};

const { down:evtDown, move:evtMove, up:evtUp } = _wcl.pursuer();
const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{inline-size:fit-content;inline-size:-moz-fit-content;display:block;}
:host{
  --msc-lens-overlay-color: rgba(0,0,0,.5);
  --msc-lens-sensor-color: rgba(255,255,255,1);
}

.main{
  --border-radius: ${borderRadius}px;
  --transition-duration: ${transitionDuration}ms;
  --opacity: 0;

  /* trigger */
  --trigger-size: 40px;
  --trigger-bgcolor-normal: rgba(0,0,0,.3);
  --trigger-bgcolor-active: rgba(0,0,0,.6);
  --icon-lens: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCcgc3R5bGU9J2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjQgMjQnIHhtbDpzcGFjZT0ncHJlc2VydmUnPjxwYXRoIGZpbGw9JyNmZmYnIGQ9J000LjU4IDcuMzVjMC0xLjUyIDEuMjQtMi43NiAyLjc2LTIuNzZIOS43VjEuNzFINy4zNWMtMy4xMSAwLTUuNjMgMi41My01LjYzIDUuNjNWOS43aDIuODdWNy4zNXpNMTYuNjUgNC41OGMxLjUyIDAgMi43NiAxLjI0IDIuNzYgMi43NlY5LjdoMi44N1Y3LjM1YzAtMy4xMS0yLjUzLTUuNjMtNS42My01LjYzSDE0LjN2Mi44N2gyLjM1ek03LjM1IDE5LjQyYy0xLjUyIDAtMi43Ni0xLjI0LTIuNzYtMi43NlYxNC4zSDEuNzF2Mi4zNmMwIDMuMTEgMi41MyA1LjYzIDUuNjMgNS42M0g5Ljd2LTIuODdINy4zNXonLz48Y2lyY2xlIGZpbGw9JyNmZmYnIGNsYXNzPSdzdDInIGN4PScxMicgY3k9JzEyJyByPSczLjk5Jy8+PHBhdGggZmlsbD0nI2ZmZicgZD0nTTIxLjE0IDE4Ljg4YzAgMS4yNi0xLjAyIDIuMjctMi4yNyAyLjI3LTEuMjYgMC0yLjI3LTEuMDItMi4yNy0yLjI3IDAtMS4yNiAxLjAyLTIuMjcgMi4yNy0yLjI3czIuMjcgMS4wMiAyLjI3IDIuMjd6Jy8+PC9zdmc+) no-repeat 50% 50%/1.5em auto;
  --icon-close: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIGhlaWdodD0nMjQnIHdpZHRoPScyNCc+PHBhdGggZD0nTTAgMGgyNHYyNEgweicgZmlsbD0nbm9uZScvPjxwYXRoIGZpbGw9JyNGRkYnIGQ9J00xOSA2LjQxIDE3LjU5IDUgMTIgMTAuNTkgNi40MSA1IDUgNi40MSAxMC41OSAxMiA1IDE3LjU5IDYuNDEgMTkgMTIgMTMuNDEgMTcuNTkgMTkgMTkgMTcuNTkgMTMuNDEgMTJ6Jy8+PC9zdmc+) no-repeat 50% 50%/1.5em auto;
  --trigger-bgcolor: var(--trigger-bgcolor-normal);
  --trigger-icon: var(--icon-lens);

  /* overlay */
  --overlay-inline-size-normal: 0;
  --overlay-block-size-normal: 0;
  --overlay-inline-size-active: 100%;
  --overlay-block-size-active: 100%;
  --overlay-inline-size: var(--overlay-inline-size-normal);
  --overlay-block-size: var(--overlay-block-size-normal);

  /* selection */
  --selection-x: 0px;
  --selection-y: 0px;
  --selection-inline-size: 0px;
  --selection-block-size: 0px;
  --sensor-border-size: 4px;
  --sensor-size: ${defaults.sensorsize}px;
  --sensor-color: var(--msc-lens-sensor-color);
  --sensor-xy: calc(var(--sensor-border-size) * -1);
  --sensor-border-radius: calc(var(--sensor-border-size) + var(--border-radius));
  --sensor-mask: polygon(0% 0%, var(--sensor-size) 0%, var(--sensor-size) var(--sensor-size), 0% var(--sensor-size), 0% 0%, 0% calc(100% - var(--sensor-size)), var(--sensor-size) calc(100% - var(--sensor-size)), var(--sensor-size) 100%, 0 100%, 0% calc(100% - var(--sensor-size)), 0% 100%, 100% 100%, 100% calc(100% - var(--sensor-size)), calc(100% - var(--sensor-size)) calc(100% - var(--sensor-size)), calc(100% - var(--sensor-size)) 100%, 0% 100%, 0% 0%, 100% 0%, 100% var(--sensor-size), calc(100% - var(--sensor-size)) var(--sensor-size), calc(100% - var(--sensor-size)) 0%, 0% 0%);
}
.main{position:relative;}
.main::before{position:absolute;inset-inline-start:0;inset-block-start:0;inline-size:var(--overlay-inline-size);block-size:var(--overlay-block-size);content:'';background:var(--msc-lens-overlay-color);opacity:var(--opacity);transition:opacity 100ms ease,clip-path var(--transition-duration);clip-path:var(--overlay-mask);}
.selection{position:absolute;inset-inline-start:var(--selection-x);inset-block-start:var(--selection-y);inline-size:var(--selection-inline-size);block-size:var(--selection-block-size);border-radius:var(--border-radius);transition:all var(--transition-duration);opacity:var(--opacity);}
.selection::before{position:absolute;content:'';inset-inline-start:var(--sensor-xy);inset-block-start:var(--sensor-xy);inline-size:100%;block-size:100%;border:var(--sensor-border-size) solid var(--sensor-color);border-radius:var(--sensor-border-radius);clip-path:var(--sensor-mask);}
::slotted(img){display:block;}

.trigger{position:absolute;inset-inline-end:8px;inset-block-start:8px;inline-size:var(--trigger-size);block-size:var(--trigger-size);border-radius:var(--trigger-size);background:var(--trigger-icon);background-color:var(--trigger-bgcolor);transition:background 200ms ease;}
.trigger:focus{--trigger-bgcolor:var(--trigger-bgcolor-active);}
.trigger:active{transform:scale(.95);}

:host([active]) .main{
  /* overlay */
  --overlay-inline-size: var(--overlay-inline-size-active);
  --overlay-block-size: var(--overlay-block-size-active);
  --opacity: 1;

  /* trigger */
  --trigger-icon: var(--icon-close);
}

.main--basis{}
.main--active{}
.main--dragging{}
.main.main--dragging{--transition-duration:0;pointer-event:none;}

@media (hover: hover) {
  .trigger:hover{--trigger-bgcolor:var(--trigger-bgcolor-active);}
}
</style>

<div class="main main--basis">
  <slot name="msc-lens-vision"></slot>
  <div class="selection"></div>
  <a class="trigger stuff" title="switch mode" aria-label="switch mode">switch mode</a>
</div>
`;

// Houdini Props and Vals
if (CSS?.registerProperty) {
  CSS.registerProperty({
    name: '--msc-lens-overlay-color',
    syntax: '<color>',
    inherits: true,
    initialValue: 'rgba(0,0,0,.5)'
  });

  CSS.registerProperty({
    name: '--msc-lens-sensor-color',
    syntax: '<color>',
    inherits: true,
    initialValue: 'rgba(255,255,255,1)'
  });
}

export class MscLens extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      minorController: '',
      ddController: '',
      dX: 0,
      dY: 0,
      action: '',
      freeze: false,
      nW: 0,
      nH: 0,
      iid: '',
      iid4Fetch: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      selection: this.shadowRoot.querySelector('.selection'),
      trigger: this.shadowRoot.querySelector('.trigger'),
      source: ''
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscLens(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
    this._onTransitionend = this._onTransitionend.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onTriggerClick = this._onTriggerClick.bind(this);
    this._onTouch = this._onTouch.bind(this);
  }

  async connectedCallback() {
    const { trigger } = this.#nodes;
    const { config, error } = await _wcl.getWCConfig(this);

    // clear
    this._clearMain();

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // load image source
    try {
      /*
       * Allowing cross-origin use of images and canvas
       * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
       */
      this.#nodes.source = this.querySelector('img[slot="msc-lens-vision"]');
      this.#nodes.source.crossOrigin = 'Anonymous';

      const { naturalWidth, naturalHeight } = await this._loadSource();
      
      this.#data.nW = naturalWidth;
      this.#data.nH = naturalHeight;
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
      this.remove();
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this._upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    trigger.addEventListener('click', this._onTriggerClick, { signal });

    if (_wcl.isEventSupport('touchstart')) {
      /*
       * CSS :active can only active when event: touchstart add
       * https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html
       */
      trigger.addEventListener('touchstart', this._onTouch, { signal });
    }
  }

  disconnectedCallback() {
    if (this.#data.controller?.abort) {
      this.#data.controller.abort();
    }

    if (this.#data.minorController?.abort) {
      this.#data.minorController.abort();
    }
  }

  _format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'delay': {
          const delay = +newValue;
          this.#config[attrName] = (isNaN(delay) || delay <= 0) ? defaults.delay : delay;
          break;
        }
        case 'sensorsize': {
          const sensorsize = +newValue;
          this.#config[attrName] = (isNaN(sensorsize) || sensorsize <= 0) ? defaults.sensorsize : sensorsize;
          break;
        }
        case 'active':
          this.#config[attrName] = true;
          break;
        case 'format':
          this.#config[attrName] = ['blob', 'dataURL'].includes(newValue) ? newValue : defaults.format;
          break;
        case 'webservice':
          this.#config[attrName] = JSON.parse(newValue);
          break;
        default:
          this.#config[attrName] = newValue;
          break;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscLens.observedAttributes.includes(attrName)) {
      return;
    }

    this._format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'sensorsize':
        this._setCustomProperties();
        break;
      case 'active': {
        this._clearMain();

        // cancel events binding
        if (this.#data.minorController?.abort) {
          this.#data.minorController.abort();
        }

        if (this.active) {
          // event binding
          this.#data.minorController = new AbortController();
          
          const signal = this.#data.minorController.signal;
          const { main, selection } = this.#nodes;

          main.addEventListener('click', this._onClick, { signal });
          selection.addEventListener(evtDown, this._onDown, { signal });
          selection.addEventListener('transitionend', this._onTransitionend, { signal });
          window.addEventListener('resize', this._onResize, { signal });

          this._onClick();
        }

        this._fireEvent(custumEvents.switch, { active:this.active });
        break;
      }
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscLens.observedAttributes
  }

  _upgradeProperty(prop) {
    let value;

    if (MscLens.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set webservice(value) {
    if (value) {
      const newValue = {
        ...this.webservice,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('webservice', JSON.stringify(newValue));
    } else {
      this.removeAttribute('webservice');
    }
  }

  get webservice() {
    return this.#config.webservice;
  }

  set delay(value) {
    if (value) {
      this.setAttribute('delay', value);
    } else {
      this.removeAttribute('delay');
    }
  }

  get delay() {
    return this.#config.delay;
  }

  set format(value) {
    if (value) {
      this.setAttribute('format', value);
    } else {
      this.removeAttribute('format');
    }
  }

  get format() {
    return this.#config.format;
  }

  set sensorsize(value) {
    if (value) {
      this.setAttribute('sensorsize', value);
    } else {
      this.removeAttribute('sensorsize');
    }
  }

  get sensorsize() {
    return this.#config.sensorsize;
  }

  set active(value) {
    this.toggleAttribute('active', Boolean(value));
  }

  get active() {
    return this.#config.active;
  }

  _fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _loadSource() {
    return new Promise(
      (resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          resolve({
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
        };
        img.onerror = () => {
          reject();
        };

        img.src = this.#nodes.source.src;
      }
    );
  }

  _genMask(info = {}) {
    const { cW, cH } = this.#data;

    const {
      oX = cW / 2,
      oY = cH / 2,
      radius = borderRadius,
      inlineSize = 0,
      blockSize = 0,
    } = info;

    return `M 0 0 V ${cH} H ${oX + radius} V ${oY + blockSize} A ${radius} ${radius} 0 0 1 ${oX} ${oY + blockSize - radius} V ${oY + radius} A ${radius} ${radius} 0 0 1 ${oX + radius} ${oY} H ${oX + inlineSize - radius} A ${radius} ${radius} 0 0 1 ${oX + inlineSize} ${oY + radius} V ${oY + blockSize - radius} A ${radius} ${radius} 0 0 1 ${oX + inlineSize - radius} ${oY + blockSize} H ${oX + radius} V ${cH} H ${cW} V 0 Z`;
  }

  _setCustomProperties(info = {}) {
    const { styleSheet } = this.#nodes;
    const { cW, cH } = this.#data;

    const {
      type = 'basis',
      oX = cW / 2,
      oY = cH / 2,
      inlineSize = 0,
      blockSize = 0
    } = info;

    _wcl.addStylesheetRules(`.main--${type}`,
      {
        '--selection-x': `${oX}px`,
        '--selection-y': `${oY}px`,
        '--selection-inline-size': `${inlineSize}px`,
        '--selection-block-size': `${blockSize}px`,
        '--overlay-mask': `path('${this._genMask({ oX, oY, inlineSize, blockSize })}')`,
        ...(type === 'basis' && { '--sensor-size': `${this.sensorsize}px` })
      }
    , styleSheet);
  }

  _clearMain() {
    clearTimeout(this.#data.iid);
    this.#nodes.main.classList.remove('main--active', 'main--dragging');
  }

  _onClick(evt) {
    if (!this.active || this.dataset.action || this.#data.freeze) {
      return;
    }

    this._updateInfo();
    const { main } = this.#nodes;
    const { cW, cH, cX, cY } = this.#data;
    const size = Math.min(cW, cH) / 2;
    let pX, pY;
    if (evt) {
      const { x, y } = _wcl.pointer(evt);
      pX = x;
      pY = y;
    } else {
      pX = cX + cW / 2;
      pY = cY + cH / 2;
    }
    const oX = pX - cX;
    const oY = pY - cY;

    this._clearMain();

    // basis
    this._setCustomProperties({
      type: 'basis',
      oX,
      oY
    });

    // active
    const aX = (oX - size/2) > 0 ? (oX - size/2) : 0;
    const aY = (oY - size/2) > 0 ? (oY - size/2) : 0;

    this._setCustomProperties({
      type: 'active',
      oX: aX,
      oY: aY,
      inlineSize: (aX + size > cW) ? (cW - aX) : (oX - aX + size/2),
      blockSize: (aY + size > cH) ? (cH - aY) : (oY - aY + size/2)
    });

    this.#data.iid = setTimeout(
      () => {
        main.classList.add('main--active');
      }
    , transitionDuration);
  }

  _updateInfo() {
    const { main, selection } = this.#nodes;
    const { x:sX, y:sY, width:sW, height:sH } = selection.getBoundingClientRect();
    const { x:cX, y:cY, width:cW, height:cH } = main.getBoundingClientRect();

    this.#data = {
      ...this.#data,
      sX: sX + _wcl.scrollX,
      sY: sY + _wcl.scrollY,
      sW,
      sH,
      cX: cX + _wcl.scrollX,
      cY: cY + _wcl.scrollY,
      cW,
      cH
    };
  }

  _detectAction({ pX, pY }) {
    const { sX, sY, sW, sH } = this.#data;
    const sensorsize = this.sensorsize;
    let action = 'move';

    // sensorSize
    if (pX >= sX && pX <= sX + sensorsize && pY >= sY && pY <= sY + sensorsize) {
      action = 'resizeLT';
    } else if (pX >= sX + sW - sensorsize && pX <= sX + sW && pY >= sY && pY <= sY + sensorsize) {
      action = 'resizeRT';
    } else if (pX >= sX && pX <= sX + sensorsize && pY >= sY + sH - sensorsize && pY <= sY + sH) {
      action = 'resizeLB';
    } else if (pX >= sX + sW - sensorsize && pX <= sX + sW && pY >= sY + sH - sensorsize && pY <= sY + sH) {
      action = 'resizeRB';
    }

    return action;
  }

  _onDown(evt) {
    this.#data.ddController = new AbortController();

    const html = document.querySelector('html');
    const signal = this.#data.ddController.signal;
    const { x:pX, y:pY } = _wcl.pointer(evt);

    if ((typeof evt.buttons !== 'undefined' && evt.buttons !== 1) || this.dataset.action) {
      return;
    }

    evt.preventDefault();

    // evts
    html.addEventListener(evtMove, this._onMove, { signal });
    html.addEventListener(evtUp, this._onUp, { signal });

    // state
    this.#nodes.main.classList.add('main--dragging');
    this._updateInfo();
    this.#data.dX = pX - this.#data.sX;
    this.#data.dY = pY - this.#data.sY;
    this.#data.action = this._detectAction({ pX, pY });
    this.dataset.action = this.#data.action;
  }

  _onMove(evt) {
    const { x:pX, y:pY } = _wcl.pointer(evt);
    const minSize = this.sensorsize * 2;
    const { sX, sY, dX, dY, sW, sH, cW, cH, cX, cY } = this.#data;

    const limitLeft = cX;
    const limitRight = cX + cW;
    const limitTop = cY;
    const limitBottom = cY + cH;
    let info;

    if ((typeof evt.buttons !== 'undefined' && evt.buttons !== 1) || !this.dataset.action) {
      return;
    }

    this.#data.freeze = true;

    switch (this.dataset.action) {
      case 'move': {
        let oX, oY;

        oX = pX - dX;
        oY = pY - dY;

        if (oX < limitLeft) {
          oX = limitLeft;
        } else if (oX + sW > limitRight) {
          oX = limitRight - sW;
        }

        if (oY < limitTop) {
          oY = limitTop;
        } else if (oY + sH > limitBottom) {
          oY = limitBottom - sH;
        }

        info = {
          oX: oX - cX,
          oY: oY - cY,
          inlineSize: sW,
          blockSize: sH
        };
        break;
      }
      case 'resizeRB': {
        const deltaX = sW - dX;
        const deltaY = sH - dY;

        let inlineSize = pX + deltaX - sX;
        let blockSize = pY + deltaY - sY;

        if (inlineSize < minSize) {
          inlineSize = minSize;
        } else if (sX + inlineSize > limitRight) {
          inlineSize = limitRight - sX;
        }

        if (blockSize < minSize) {
          blockSize = minSize;
        } else if (sY + blockSize > limitBottom) {
          blockSize = limitBottom - sY;
        }

        info = {
          oX: sX - cX,
          oY: sY - cY,
          inlineSize,
          blockSize
        };
        break;
      }
      case 'resizeRT': {
        const deltaX = sW - dX;
        const lY = sY + sH; // limit Y

        let inlineSize = pX + deltaX - sX;
        let blockSize = lY - (pY - dY);

        if (inlineSize < minSize) {
          inlineSize = minSize;
        } else if (sX + inlineSize > limitRight) {
          inlineSize = limitRight - sX;
        }
        
        if (blockSize < minSize) {
          blockSize = minSize;
        } else if (lY - blockSize < limitTop) {
          blockSize = lY - limitTop;
        }

        info = {
          oX: sX - cX,
          oY: (lY - blockSize) - cY,
          inlineSize,
          blockSize
        };
        break;
      }
      case 'resizeLT': {
        const lY = sY + sH; // limit Y
        const lX = sX + sW; // limit X

        let inlineSize = lX - (pX - dX);
        let blockSize = lY - (pY - dY);

        if (inlineSize < minSize) {
          inlineSize = minSize;
        } else if (lX - inlineSize < limitLeft) {
          inlineSize = lX - limitLeft;
        }

        if (blockSize < minSize) {
          blockSize = minSize;
        } else if (lY - blockSize < limitTop) {
          blockSize = lY - limitTop;
        }

        info = {
          oX: (lX - inlineSize) - cX,
          oY: (lY - blockSize) - cY,
          inlineSize,
          blockSize
        };
        break;
      }
      case 'resizeLB': {
        const lX = sX + sW; // limit X
        const deltaY = sH - dY;

        let inlineSize = lX - (pX - dX); // selection width
        let blockSize = pY + deltaY - sY; // selection height

        if (inlineSize < minSize) {
          inlineSize = minSize;
        } else if (lX - inlineSize < limitLeft) {
          inlineSize = lX - limitLeft;
        }

        if (blockSize < minSize) {
          blockSize = minSize;
        } else if (sY + blockSize > limitBottom) {
          blockSize = limitBottom - sY;
        }

        info = {
          oX: (lX - inlineSize) - cX,
          oY: sY - cY,
          inlineSize,
          blockSize
        };
        break;
      }
    }

    this._setCustomProperties({ type:'active', ...info });
  }

  _onUp(evt) {
    if ((typeof evt.buttons !== 'undefined' && (evt.buttons & 1)) || !this.dataset.action) {
      return;
    }

    this.#data.ddController.abort();
    this.#nodes.main.classList.remove('main--dragging');

    delete this.dataset.action;

    this._capture();

    // prevent fire click event 
    setTimeout(
      () => {
        this.#data.freeze = false;
      }
    , 50);
  }

  async _fetch(image) {
    const { uri, fieldName, params } = this.webservice;

    if (!uri) {
      return;
    }

    const url = new URL(uri);
    const formData = new FormData();

    formData.set(fieldName, image);
    Object.keys(params).forEach(
      (key) => {
        formData.set(key, params[key]);
      }
    );

    let response = {};
    this._fireEvent(custumEvents.process);
    
    try {
      response = await fetch(url.toString(), {
        /*
         * let browser decide, do not set content-type
         * https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
         */
        // headers: {
        //   'content-type': 'multipart/form-data'
        // },
        method: 'POST',
        mode: 'cors',
        body: formData
      })
      .then(
        (response) => {
          if (!response.ok) {
            throw new Error('Network response was not OK');
          }

          return response.json();
        }
      )
      .catch(
        (err) => {
          return { error:err.message };
        }
      );
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
    }

    this._fireEvent(custumEvents.result, { result:response });
  }

  _capture() {
    this._updateInfo();
    const { sW, sH, sX, sY, cW, cH, cX, cY, nW, nH } = this.#data;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = (sW * nW) / cW;
    const height = (sH * nH) / cH;
    const deltaX = (sX - cX) * (nW / cW);
    const deltaY = (sY - cY) * (nH / cH);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(this.querySelector('img'), deltaX, deltaY, width, height, 0, 0, width, height);

    const captureDone = (image) => {
      this._fireEvent(custumEvents.capture, { image });

      clearTimeout(this.#data.iid4Fetch);
      this.#data.iid4Fetch = setTimeout(
        () => {
          this._fetch(image);
        }
      , this.delay);
    };

    if (this.format === 'blob') {
      canvas.toBlob(
        (image) => {
          captureDone(image);
        }
      );
    } else {
      const image = canvas.toDataURL();
      captureDone(image);
    }
  }

  _onTransitionend(evt) {
    if (this.#nodes.main.classList.contains('main--active') && evt.propertyName === 'width') {
      this._capture();
    }
  }

  _onResize() {
    if (this.active) {
      const { width, height } = this.#nodes.main.getBoundingClientRect();
      const { cW, cH } = this.#data;

      if (width !== cW && height !== cH) {
        this._onClick();
      }
    }
  }

  _onTriggerClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.active = !this.active;
  }

  _onTouch() {
    // do nothing
  }

  toggle(force) {
    if (typeof force === 'boolean') {
      this.active = force;
    } else {
      this.active = !this.active;
    }
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscLens');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscLens'), MscLens);
}