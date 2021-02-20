import { Component } from '@angular/core';
import { ImageCropperResult } from './cropper/cropper.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'angular-cropper-sample';
  imageUrl = '/assets/images/sample-pic.jpg';
  config = {
    aspectRatio: 1,
    dragMode: 'move',
    background: true,
    movable: true,
    rotatable: true,
    scalable: true,
    zoomable: true,
    viewMode: 1,
    checkImageOrigin: true,
    cropmove: this.cropMoved.bind(this),
    checkCrossOrigin: true,
    ready: this.ready.bind(this),
  };

  /**
   * ファイルをダウンロードします。
   *
   * @param result
   */
  handleDownload(result: ImageCropperResult) {
    console.log(result);
    if (result.dataUrl) {
      const link = document.createElement('a');
      link.href = result.dataUrl;
      link.download = result.fileName ?? 'cropped-pic.png';
      link.click();
    }
  }

  private cropMoved() {
    console.log('cropMoved executed.');
  }

  private ready() {
    console.log('ready executed.');
  }
}
