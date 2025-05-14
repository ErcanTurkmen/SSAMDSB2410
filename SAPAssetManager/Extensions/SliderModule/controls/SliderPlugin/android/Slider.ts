import { Device, View, Utils, Application } from '@nativescript/core';

declare var android: any;

export function GetSliderClass() {
    function getPadding() {
        return Device.deviceType === 'Tablet' ? 24 : 16;
    }

    class Slider extends View {
        private _androidcontext;
        private _label;
        private _minLabel;
        private _maxLabel;
        private _labelText = "";
        private _unitText = "";
        private _seekbar;
        private _layout;
        private _value = 0;
        private _min = 0; //Used to track min for API 25 or lower

        static readonly TITLE_SIZE = 18;
        static readonly TEXT_COLOR = "#000000";
        static readonly TEXT_COLOR_DARK = "#ffffff";

        private updateText() {
            this._label.setText(this._labelText + " (" + this._value + " " + this._unitText + ")")
        }

        public constructor(context: any) {
            super();
            this._androidcontext = context;
            this.createNativeView();
        }
        public createNativeView(): Object {
          const labelPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(8));
          const labelView = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                         android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
          this._label = new android.widget.TextView(this._androidcontext);
          this._label.setTextSize(Slider.TITLE_SIZE);
          this._label.setTextColor(this.getTextColor());
          this._label.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);;
          this._label.setPadding(0, 0, 0, labelPaddingInPx);
          this._label.setLayoutParams(labelView);

          const minLabelView = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                                                                            android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
          this._minLabel = new android.widget.TextView(this._androidcontext);
          this._minLabel.setTextColor(this.getTextColor());
          this._minLabel.setLayoutParams(minLabelView);

          const seekBarView = new android.widget.LinearLayout.LayoutParams(0, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, 1);
          this._seekbar = new android.widget.SeekBar(this._androidcontext);
          this._seekbar.setLayoutParams(seekBarView);

          const maxLabelView = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                                                                            android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
          this._maxLabel = new android.widget.TextView(this._androidcontext);
          this._maxLabel.setTextColor(this.getTextColor());
          this._maxLabel.setLayoutParams(maxLabelView);

          const subLayoutView = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                             android.widget.LinearLayout.LayoutParams.MATCH_PARENT);
          const subLayout = new android.widget.LinearLayout(this._androidcontext);
          subLayout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
          subLayout.setLayoutParams(subLayoutView);
          subLayout.addView(this._minLabel);
          subLayout.addView(this._seekbar);
          subLayout.addView(this._maxLabel);

          const hortPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(getPadding()));
          const vertPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(16)); // For top & bottom padding, always 16dp
          const layoutView = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                          android.widget.LinearLayout.LayoutParams.MATCH_PARENT);
          this._layout = new android.widget.LinearLayout(this._androidcontext);
          this._layout.setOrientation(android.widget.LinearLayout.VERTICAL);
          this._layout.setLayoutParams(layoutView);
          this._layout.setPadding(hortPaddingInPx, vertPaddingInPx, hortPaddingInPx, vertPaddingInPx);
          this._layout.addView(this._label);
          this._layout.addView(subLayout);
          this.setNativeView(this._layout);

          return this._layout;
        }

        initNativeView(): void {
            console.log("initNativeView called");
            // Attach the owner to nativeView.
            // When nativeView is tapped you get the owning JS object through this field.
            (<any>this._seekbar).owner = this;
            (<any>this._layout).owner = this;
            super.initNativeView();

            this._seekbar.setOnSeekBarChangeListener(new android.widget.SeekBar.OnSeekBarChangeListener({
                onStartTrackingTouch(seekBar: any) {
                },
                onStopTrackingTouch(seekBar: any) {
                    var eventData = {
                        eventName: "OnSliderValueChanged",
                        object: seekBar.owner,
                        value: seekBar.owner._value
                    };
                    seekBar.owner.notify(eventData);
                },
                onProgressChanged(seekBar: any, progress: number, fromUser: boolean) {
                    seekBar.owner._value = progress;
                    seekBar.owner.updateText();
                }
            }));
        }

        disposeNativeView(): void {
            (<any>this._seekbar).owner = null;
            (<any>this._layout).owner = null;
        }

        public getView(): any {
            return this._layout;
        }

        public setText(newText: string): void {
            if (newText != null && newText != undefined) {
                this._labelText = newText;
                this._label.setText(newText);
            }
        }

        public setValue(newVal: number): void {
            if (newVal != null && newVal != undefined) {
                this._value = newVal;
                this.updateText();
                if (this._seekbar.getProgress() < this._min) {
                    this._seekbar.setProgress(this._min);
                }
                else {
                    this._seekbar.setProgress(newVal);
                }
            }
        }

        public setMinValue(newMin: number): void {
            if (newMin != null && newMin != undefined) {
                if (Device.sdkVersion >= '26') { //setMin is only available in set API Level 26 or newer
                    this._seekbar.setMin(newMin);
                } else {
                    this._min = newMin;
                    if (this._seekbar.getProgress() < this._min) {
                        this._seekbar.setProgress(this._min);
                    }
                }
                if (this._minLabel) {
                  this._minLabel.setText(newMin.toString() + " " + this._unitText);
                }
            }
        }

        public setMaxValue(newMax: number): void {
            if (newMax != null && newMax != undefined) {
                this._seekbar.setMax(newMax);
                if (this._maxLabel) {
                  this._maxLabel.setText(newMax.toString() + " " + this._unitText);
                }
            }
        }

        public setUnit(unit: string): void {
          if (unit != null && unit != undefined) {
              this._unitText = unit;
          }
        }

        private getTextColor(): any {
          return android.graphics.Color.parseColor(Application.systemAppearance() === 'dark' ?
                          Slider.TEXT_COLOR_DARK : Slider.TEXT_COLOR);
        }
    }
    return Slider;
}
