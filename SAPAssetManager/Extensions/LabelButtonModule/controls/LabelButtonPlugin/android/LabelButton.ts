import { View, Utils, Device } from '@nativescript/core';
/*
  This is a way to keep iOS and Android implementation of your extension separate
  We will encapsulate the LabelButton class definition inside a function called GetLabelButtonClass
  This is so that the class definition won't be executed when you load this javascript
  via require function.
  The class definition will only be executed when you execute GetLabelButtonClass
*/
declare let com: any;
declare let android: any;
export function GetLabelButtonClass() {

  function isTablet() {
    return Device.deviceType === 'Tablet';
  }

  function getPadding() {
    return isTablet() ? 24 : 3;
  }

  class LabelButton extends View {
    private _androidcontext;
    private _layout;
    private _label;
    private _button;

    static readonly TRANSPARENT_BACKGROUND = 0x00000000;

    public constructor(context: any) {
      super();
      this._androidcontext = context;
      this.createNativeView();
    }

    public createNativeView(): Object {
      this._layout = new android.widget.LinearLayout(this._androidcontext);
      this._layout.setOrientation(android.widget.LinearLayout.HORIZONTAL);
      this._layout.setGravity(android.view.Gravity.CENTER_VERTICAL);
      this._layout.setLayoutParams(new android.view.ViewGroup.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
        android.widget.LinearLayout.LayoutParams.MATCH_PARENT));

      const hortPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(getPadding()));
      const vertPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(0)); 
      this._layout.setPadding(hortPaddingInPx, vertPaddingInPx, hortPaddingInPx, vertPaddingInPx);

      this.setNativeView(this._layout);

      return this._layout;
    }

    initNativeView(): void {
      (<any>this._layout).owner = this;
      super.initNativeView();
    }

    disposeNativeView(): void {
      (<any>this._layout).owner = null;
      (<any>this._label).owner = null;
    }

    public getView(): any {
      return this._layout;
    }

    private createLabel(labelText: string):  any {
      let label = new android.widget.TextView(this._androidcontext);
      label.setText(labelText);
      return label;
    }

    private createButton(buttonProps: any): any {
      let button = new com.sap.cloud.mobile.fiori.formcell.ButtonFormCell(this._androidcontext);
      button.setMinWidth(0);
      button.setMinHeight(0);
      button.setText(buttonProps.Title);
      button.setTextSize(14);
      button.setPadding(0,0,0,0);
      button.setBackgroundColor(LabelButton.TRANSPARENT_BACKGROUND);
      (<any>button).owner = this;
      button.setOnClickListener(new android.view.View.OnClickListener({
        onClick(button: any) {
          if(button.owner) {
            button.owner.toggleButton();
            let eventData = {
                eventName: "OnButtonClick",
                object: button.owner,
                value: button.owner.getButton()
            };
            button.owner.notify(eventData);
          }
        }
      }));
      button.OnPress = buttonProps.OnPress;
      button._toggleValue = buttonProps.ToggleValue;
      return button;
    }

    private createSpaceView() : any {
      let space = new android.widget.LinearLayout(this._androidcontext);
      space.setLayoutParams(new android.widget.LinearLayout.LayoutParams(0,0, 1));
      return space;
    }

    public addControls(label: string, buttonProps: any) {
      this._label = this.createLabel(label);
      const spaceView = this.createSpaceView();
      this._button = this.createButton(buttonProps);

      this._layout.addView(this._label);
      this._layout.addView(spaceView);
      this._layout.addView(this._button);
    }

    public setLabelText(labelText: string) {
      if(this._label) {
        this._label.setText(labelText);
      }
    }

    public setButtonTitle(title: string) {
        if (this._button) {
            this._button.setText(title);
        }
    }

    public toggleButton() {
      if(this._button) {
          if(this._button._toggleValue !== undefined) {
              this._button._toggleValue = !this._button._toggleValue;
          }
      }
    }

    public getButton() {
        return this._button;
    }

    public getButtonState() {
        if(this._button) {
            return this._button._toggleValue;
        }
    }
  }
  return LabelButton;
}
