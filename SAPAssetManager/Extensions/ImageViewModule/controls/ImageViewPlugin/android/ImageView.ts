import { Device, View, Utils, Application } from '@nativescript/core';

declare var android: any;

export function GetImageViewClass() {
    function getPadding() {
        return Device.deviceType === 'Tablet' ? 24 : 16;
    }

    class ImageView extends View {
        private _androidcontext;
        private _imageView;
        private _layout;

        public constructor(context: any) {
            super();
            this._androidcontext = context;
            this.createNativeView();
        }

        public createNativeView(): Object {
          const hortPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(getPadding()));
          const vertPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(16)); // For top & bottom padding, always 16dp
          const layoutView = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                          android.widget.LinearLayout.LayoutParams.MATCH_PARENT);

          const imageView = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                         android.widget.LinearLayout.LayoutParams.MATCH_PARENT);
          this._imageView = new android.widget.ImageView(this._androidcontext);
          this._imageView.setLayoutParams(imageView);

          this._layout = new android.widget.LinearLayout(this._androidcontext);
          this._layout.setOrientation(android.widget.LinearLayout.VERTICAL);
          this._layout.setLayoutParams(layoutView);
          this._layout.setPadding(hortPaddingInPx, vertPaddingInPx, hortPaddingInPx, vertPaddingInPx);
          this._layout.addView(this._imageView);
          this.setNativeView(this._layout);

          return this._layout;
        }

        initNativeView(): void {
            // Attach the owner to nativeView.
            // When nativeView is tapped you get the owning JS object through this field.
            (<any>this._imageView).owner = this;
            (<any>this._layout).owner = this;
            super.initNativeView();
        }

        disposeNativeView(): void {
            (<any>this._imageView).owner = null;
            (<any>this._layout).owner = null;
        }

        public getView(): any {
            return this._layout;
        }

        public loadImageView(filePath: string): void {
            if (filePath != null && filePath != undefined) {
                const bitmap = android.graphics.BitmapFactory.decodeFile(filePath);
                if (this._imageView && bitmap) {
                    this._imageView.setImageBitmap(bitmap);
                }
            }
        }
    }
    return ImageView;
}
