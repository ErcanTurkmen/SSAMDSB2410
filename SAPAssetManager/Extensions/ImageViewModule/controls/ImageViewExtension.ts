import { BaseControl } from 'mdk-core/controls/BaseControl';
import { ImageView } from './ImageViewPlugin/ImageView'

export class ImageViewClass extends BaseControl {
    private _imageView: InstanceType<typeof ImageView>;

    public initialize(props) {
        super.initialize(props);
        this.createImageView();
        this.setView(this._imageView.getView());
    }

    private createImageView() {
        this._imageView = new ImageView(this.androidContext());
        this._imageView.initNativeView();

        let extProps = this.definition().data.ExtensionProperties;
        if (extProps) {
            this.valueResolver().resolveValue(extProps.FilePath, this.context, true).then(function (filePath) {
              this._imageView.loadImageView(filePath);
            }.bind(this));
        }
    }

    protected createObservable() {
        return super.createObservable();
    }

    public viewIsNative() {
        return true;
    }
}
