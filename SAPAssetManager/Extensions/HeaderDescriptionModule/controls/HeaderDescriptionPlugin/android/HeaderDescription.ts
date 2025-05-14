import { View, Utils, Device } from '@nativescript/core';
/*
  This is a way to keep iOS and Android implementation of your extension separate
  We will encapsulate the HeaderDescription class definition inside a function called GetHeaderDescriptionClass
  This is so that the class definition won't be executed when you load this javascript
  via require function.
  The class definition will only be executed when you execute GetHeaderDescriptionClass
*/
declare let com: any;
declare let android: any;
export function GetHeaderDescriptionClass() {

  function isTablet() {
    return Device.deviceType === 'Tablet';
  }

  function getPadding() {
    return isTablet() ? 24 : 3;
  }

  class HeaderDescription extends View {
    private _androidcontext;
    private _layout;
    private _header;
    private _description;

    public constructor(context: any) {
      super();
      this._androidcontext = context;
      this.createNativeView();
    }

    public createNativeView(): Object {
      this._layout = new android.widget.LinearLayout(this._androidcontext);
      this._layout.setOrientation(android.widget.LinearLayout.VERTICAL);
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
    }

    public getView(): any {
      return this._layout;
    }

    private createLabel(text:string, isBold: boolean, fontSize: Number):  any {
      let label = new android.widget.TextView(this._androidcontext);
      label.setText(text);
      if(isBold) {
        label.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
      }
      label.setTextSize(fontSize);
      label.setMaxLines(1)
      label.setEllipsize(android.text.TextUtils.TruncateAt.END);
      return label;
    }

    private createSpaceView() : any {
      let space = new android.widget.LinearLayout(this._androidcontext);
      space.setLayoutParams(new android.widget.LinearLayout.LayoutParams(0,0, 1));
      return space;
    }

    public addControls(headerText: string, descriptionText: string) {
      this._header = this.createLabel(headerText, true, 20);
      const spaceView = this.createSpaceView();
      this._description = this.createLabel(descriptionText, false, 14);

      this._layout.addView(this._header);
      this._layout.addView(spaceView);
      this._layout.addView(this._description);
    }

    public setHeader(headerText: string) {
      if(this._header) {
        this._header.setText(headerText);
      }
    }

    public setDescription(descriptionText: string) {
        if(this._description) {
          this._description.setText(descriptionText);
        }
      }
  }
  return HeaderDescription;
}
