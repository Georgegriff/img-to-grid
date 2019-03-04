import { LitElement, html, css } from 'lit-element';
import './pixel-grid.js';
import { getPixelData } from './ImageDataExtractor.js';
class ImageToGrid extends LitElement {

  static get properties() {
    return {
      rows: { type: Number },
      columns: { type: Number },
      pixels: { type: Array },
      img: { type: String },
      scaleFactor: { type: Number }
    };
  }

  constructor() {
    super();
    this.scaleFactor = 0.06;
  }

  async connectedCallback() {
    super.connectedCallback();


  }

  onImageChange(e) {
    const { value } = e.target;
    this.img = value;
    this._updateImg();
  }

  changeSf(e) {
    const { value } = e.target;
    this.scaleFactor = value;
    this._updateImg();
  }

  async _updateImg() {
    const pixels = await getPixelData(this.img, {
      scaleFactor: this.scaleFactor
    });

    this.rows = pixels.width;
    this.columns = pixels.height;
    this.pixels = pixels.data;
  }

  static get styles() {
    return css`
          :host {
            display: block;
           
          }

          pixel-grid {
            --pixel-grid-width : 500px;
            --pixel-grid-height : 500px;
            --pixel-grid-background : #666;
          }
  
        `;
  }

  render() {
    return html`
    Provide a url to an image:
    <input @input=${this.onImageChange} type="text">
    Scale factor (lower the better perf):
    <input @input=${this.changeSf} value=${this.scaleFactor} type="text">
    <pixel-grid .pixels=${this.pixels} .rows=${this.rows} .columns=${this.columns}></pixel-grid>
    `;
  }

}

customElements.define('img-to-grid', ImageToGrid);