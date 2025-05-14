import { View } from'@nativescript/core';

export function GetSliderClass() {

    @NativeClass()
    class SliderHandler extends NSObject {

        public valueChanged(nativeSlider: UISlider, nativeEvent: _UIEvent) {
            nativeSlider.value = Math.round(nativeSlider.value);
            const owner: Slider = (<any>nativeSlider).owner;
            if (owner) {
                owner.setValue(nativeSlider.value);
            }
        }

        public afterValueChanged(nativeSlider: UISlider, nativeEvent: _UIEvent) {
            nativeSlider.value = Math.round(nativeSlider.value);
            const owner: Slider = (<any>nativeSlider).owner;
            if (owner) {
                owner.setValue(nativeSlider.value);
                var eventData = {
                    eventName: "OnSliderValueChanged",
                    object: owner,
                    value: nativeSlider.value
                };
                owner.notify(eventData);
            }
        }

        public static ObjCExposedMethods = {
            "valueChanged": { returns: interop.types.void, params: [interop.types.id, interop.types.id] },
            "afterValueChanged": { returns: interop.types.void, params: [interop.types.id, interop.types.id] }
        };
    }

    const handler = SliderHandler.new();

    class Slider extends View {
        private _label;
        private _labelText = "";
        private _unitText = "";
        private _minLabel;
        private _maxLabel;
        private _slider;
        private _stackView;
        private _value = 0;

        private updateText() {
            this._label.text = this._labelText + " (" + this._value + " " + this._unitText + ")";
        }

        public constructor(context: any) {
            super();
            this.createNativeView();
        }

        public createNativeView(): Object {
            this._stackView = UIStackView.new();
            this._stackView.autoresizingMask = [UIViewAutoresizing.FlexibleHeight, UIViewAutoresizing.FlexibleWidth];
            this._stackView.layoutMarginsRelativeArrangement = true;
            let insets = new NSDirectionalEdgeInsets();
            insets.top = 10;
            insets.leading = 20;
            insets.bottom = 10;
            insets.trailing = 30;
            this._stackView.directionalLayoutMargins = insets;

            this._stackView.axis = UILayoutConstraintAxis.Vertical;

            this._label = UILabel.new();
            this._slider = UISlider.new();   
            this._minLabel = UILabel.new();
            this._maxLabel = UILabel.new();

            const horizontalStackView = UIStackView.new();
            horizontalStackView.autoresizingMask = [UIViewAutoresizing.FlexibleHeight, UIViewAutoresizing.FlexibleWidth];
            horizontalStackView.spacing = 10;
            horizontalStackView.axis = UILayoutConstraintAxis.Horizontal;
            horizontalStackView.backgroundColor = UIColor.red
            horizontalStackView.addArrangedSubview(this._minLabel);
            horizontalStackView.addArrangedSubview(this._slider);
            horizontalStackView.addArrangedSubview(this._maxLabel);

            this._slider.addTargetActionForControlEvents(handler, "valueChanged", UIControlEvents.ValueChanged);
            this._slider.addTargetActionForControlEvents(handler, "afterValueChanged", UIControlEvents.TouchUpInside | UIControlEvents.TouchUpOutside);

            this._stackView.addArrangedSubview(this._label);
            this._stackView.addArrangedSubview(horizontalStackView);

            this.setNativeView(this._stackView);

            return this._stackView;
        }

        initNativeView(): void {
            (<any>this._slider).owner = this;
            (<any>this._stackView).owner = this;
            super.initNativeView();
        }

        disposeNativeView(): void {
            (<any>this._slider).owner = null;
            (<any>this._stackView).owner = null;
        }

        public getView(): any {
            return this._stackView;
        }

        public setText(newText: string): void {
            if (newText != null && newText != undefined) {
                this._labelText = newText;
                this._label.text = newText;
            }
        }

        public setValue(newVal: number): void {
            if (newVal != null && newVal != undefined) {
                this._value = newVal;
                this.updateText();
                this._slider.value = newVal;
            }
        }

        public setMinValue(newMin: number): void {
            if (newMin != null && newMin != undefined) {
                this._slider.minimumValue = newMin;
            }
            if (this._minLabel) {
                this._minLabel.text = newMin.toString() + " " + this._unitText;
            }
        }

        public setMaxValue(newMax: number): void {
            if (newMax != null && newMax != undefined) {
                this._slider.maximumValue = newMax;
            }
            if (this._maxLabel) {
                this._maxLabel.text = newMax.toString() + " " + this._unitText;
            }
        }

        public setUnit(unit: string): void {
            if (unit != null && unit != undefined) {
                this._unitText = unit;
            }
        }
    }

    return Slider;
}
