import { BaseControl } from 'mdk-core/controls/BaseControl';
import { Slider } from './SliderPlugin/Slider'

export class SliderClass extends BaseControl {
    private _slider: InstanceType<typeof Slider>;
    private _minVal: number = 0;
    private _maxVal: number = 10000;

    public initialize(props) {
        super.initialize(props);
        this.createSlider();
        this.setView(this._slider.getView());
    }

    private createSlider() {
        this._slider = new Slider(this.androidContext());
        this._slider.initNativeView();

        this._slider.setMinValue(this._minVal);
        this._slider.setMaxValue(this._maxVal);

        let extProps = this.definition().data.ExtensionProperties;
        if (extProps) {
            this.valueResolver().resolveValue(extProps.Unit, this.context, true).then(function (unit) {
              this._slider.setUnit(unit);
            }.bind(this));

            this.valueResolver().resolveValue(extProps.Title, this.context, true).then(function (title) {
                this._slider.setText(title);
            }.bind(this));

            this.valueResolver().resolveValue(extProps.MinValue, this.context, true).then(function (minVal) {
                if (minVal !== null && minVal !== undefined) {
                    this._minVal = minVal;
                    this._slider.setMinValue(this._minVal);
                }
            }.bind(this));

            this.valueResolver().resolveValue(extProps.MaxValue, this.context, true).then(function (maxVal) {
                if (maxVal !== null && maxVal !== undefined) {
                    this._maxVal = maxVal;
                    this._slider.setMaxValue(this._maxVal);
                }
            }.bind(this));

            this.valueResolver().resolveValue(extProps.Value, this.context, true).then(function (value) {
                this.setValue(value, false, false);
            }.bind(this));
        }

        this._slider.on("OnSliderValueChanged", function (eventData) {
            this.setValue(eventData.value, true, false);
        }.bind(this));
    }

    protected createObservable() {
        let extProps = this.definition().data.ExtensionProperties;
        if (extProps && extProps.OnValueChange) {
            this.definition().data.OnValueChange = extProps.OnValueChange;
        }
        return super.createObservable();
    }

    public setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any> {
        if (value != null && value != undefined && !isNaN(value)) {
            if (typeof value == "string" && value.trim() == "") {
                return Promise.reject("Error: Value is not a number");
            }
            let val = Number.parseInt(value);
            val = val < this._minVal ? this._minVal : val;
            val = val > this._maxVal ? this._maxVal : val;

            if (this._slider) {
                this._slider.setValue(val);
            }
            return this.observable().setValue(val, notify, isTextValue);
        } else if (isNaN(value)) {
            return Promise.reject("Error: Value is not a number");
        }
        return Promise.resolve();
    }

    public viewIsNative() {
        return true;
    }
}
