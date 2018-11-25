import {BaseViewer2D} from './image_base_viewer';
/* :: import {BaseController} from '../controllers/base_controller'; */
import Session from '../common/session';
import type {RectType} from '../functional/types';

/**
 * Image viewer Class
 */
export class AssistantViewer extends BaseViewer2D {
  /**
   * @param {BaseController} controller: corresponding controller
   * @constructor
   */
  constructor(controller /* : BaseController */) {
    super(controller, 'image-canvas', 'assistant');
    this.isAssistantView = true;
  }

  /**
   * generate image data on assistant view.
   * @return {Object}: the pixels to draw
   */
  generateLabelArea(): RectType {
    let currentLabel = this.state.current.label;
    if (currentLabel === -1) {
      return {x: 0, y: 0, w: 0, h: 0};
    }
    let currentShape = this.state.labels[currentLabel].shapes[0];
    let labelArea = this.state.shapes[currentShape];
    let [x0, y0] = this.toCanvasCoords([labelArea.x, labelArea.y]);
    let [w0, h0] = this.toCanvasCoords([labelArea.w, labelArea.h]);
    return {x: x0, y: y0, w: w0, h: h0};
  }

  /**
   * Redraw the image canvas.
   * @return {boolean}: whether redraw is successful
   */
  redraw(): boolean {
    if (!super.redraw()) {
      return false;
    }

    let item = this.getCurrentItem();
    let image = Session.images[item.index];
    // draw stuff
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(image, 0, 0, image.width, image.height,
        0, 0, this.canvas.width, this.canvas.height);
    if (this.canvas.width && this.canvas.height) {
        let labelConfig = this.generateLabelArea();
        if (labelConfig.w && labelConfig.h) {
          this.context.drawImage(this.canvas,
              labelConfig.x, labelConfig.y, labelConfig.w, labelConfig.h,
              0, 0, this.canvas.width, this.canvas.height);
        }
    }
    return true;
  }
}


