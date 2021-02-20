import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';

/**
 * ImageCropperResultインターフェースです。
 */
export interface ImageCropperResult {
  imageData: Cropper.ImageData;
  cropData: Cropper.CropBoxData;
  blob?: Blob;
  dataUrl?: string;
  fileName?: string;
}

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.less'],
})
export class CropperComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  @Input() imageUrl: any;
  @Input() cropperOptions: any = {};
  @Output() export = new EventEmitter<ImageCropperResult>();
  cropper!: Cropper;
  imageElement!: HTMLImageElement;
  fileName!: string;

  constructor() {}

  ngOnInit(): void {}

  /**
   * イメージ読み込み時の処理です。
   *
   * @param event
   */
  imageLoaded(event: Event) {
    // イメージを読み込みます
    const image = event.target as HTMLImageElement;
    this.imageElement = image;

    // cropperOptionsを初期化します
    // オプション未設定時はデフォルト値で初期化を行います
    this.cropperOptions = Object.assign(
      {
        aspectRatio: 1,
        movable: false,
        scalable: false,
        zoomable: false,
        viewMode: 1,
        checkCrossOrigin: true,
      },
      this.cropperOptions
    );

    if (this.cropper) {
      this.cropper.destroy();
    }

    this.cropper = new Cropper(image, this.cropperOptions);
  }

  /**
   * 画像を回転させます。
   *
   * @param num 回転角度
   */
  rotate(num: number) {
    this.cropper.rotate(num);
  }

  /**
   * 画像データを出力します。
   */
  exportCanvas() {
    const promise = new Promise((resolve) => {
      const canvas = this.cropper.getCroppedCanvas();
      return resolve({
        dataUrl: canvas.toDataURL('image/png'),
        fileName: this.fileName,
      });
    });

    // Promise解決時に親コンポーネントに対してイベントを発砲します
    promise.then((res) => {
      const imageData = this.cropper.getImageData();
      const cropData = this.cropper.getCropBoxData();
      const data = { imageData, cropData };
      this.export.emit(Object.assign(data, res));
    });
  }

  imageLoadError($event: ErrorEvent) {
    console.error($event);
  }

  /**
   * ファイルアップロード時の処理です。
   *
   * @param event
   */
  handleFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.item(0);

    if (file == null) {
      return;
    }

    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = (ev: any) => (this.imageUrl = ev.target.result);
    reader.readAsDataURL(file);
  }

  onClickFileInputButton() {
    this.fileInput.nativeElement.click();
  }
}
