import { Device, View } from '@nativescript/core';

export function GetImageViewClass() {
    function getInsets() {
        let insets = new NSDirectionalEdgeInsets()

        let horizontalInset = Device.deviceType === 'Tablet' ? 24 : 16;
        let verticalInset = 16;

        insets.leading = horizontalInset;
        insets.trailing = horizontalInset;
        insets.top = verticalInset;
        insets.bottom = verticalInset;

        return insets
    }

    class ImageView extends View {
        private _imageView;

        public constructor(context: any) {
            super();
            this.createNativeView();
        }

        public createNativeView(): Object {
            this._imageView = UIImageView.new();
            this._imageView.autoresizingMask = [UIViewAutoresizing.FlexibleHeight, UIViewAutoresizing.FlexibleWidth];
            this._imageView.contentMode = UIViewContentMode.ScaleAspectFit
            this._imageView.directionalLayoutMargins = getInsets()

            this.setNativeView(this._imageView);

            return this._imageView
        }

        initNativeView(): void {
            // Attach the owner to nativeView.
            // When nativeView is tapped you get the owning JS object through this field.
            (<any>this._imageView).owner = this;
            super.initNativeView();
        }

        disposeNativeView(): void {
            (<any>this._imageView).owner = null;
        }

        public getView(): any {
            return this._imageView;
        }

        public loadImageView(filePath: string): void {
            if (filePath != null && filePath != undefined && this._imageView != null) {
                let image = UIImage.alloc().initWithContentsOfFile(filePath);
                this._imageView.image = image;
            }
        }
    }

    return ImageView;
}
