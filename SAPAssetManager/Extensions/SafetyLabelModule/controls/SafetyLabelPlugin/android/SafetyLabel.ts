import { Device, View, Utils, Application } from '@nativescript/core';

declare var android: any;

export function GetSafetyLabelClass() {
    class SafetyLabel extends View {
        private _androidcontext;
        private _baseControl;
        private _view;

        static readonly DEFAULT_TEXT_COLOR = '#000000';
        static readonly DEFAULT_BG_COLOR = '#ffffff';
        static readonly IMG_METADATA = 'data:image/png;base64,';

        public constructor(contextAndroid: any, context: any, baseControl: any) {
            super();
            this._androidcontext = contextAndroid;
            this._baseControl = baseControl;
            this.createNativeView();
        }

        public createNativeView(): Object {
          // Extension Properties
          const extProps = this._baseControl.definition().data.ExtensionProperties;

          const hortPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(this.getPadding()));
          const vertPaddingInPx = Utils.layout.round(Utils.layout.toDevicePixels(8));

          // Left View
          const leftImgView = this.createImageView(extProps.symbolLeft);
          const leftLineView = this.createLineView(false);

          // Middle View
          const titleView = this.createTitleView(extProps);
          const lineView = this.createLineView(true);
          const msgView = this.createMsgView(extProps);

          const midLayout = new android.widget.LinearLayout.LayoutParams(0, android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                         this.isTablet() ? 0.8 : 0.7);
          const midView = new android.widget.LinearLayout(this._androidcontext);

          midView.setOrientation(android.widget.LinearLayout.VERTICAL);
          midView.setLayoutParams(midLayout);
          midView.addView(titleView);
          midView.addView(lineView);
          midView.addView(msgView);

          // Right View
          const rightLineView = this.createLineView(false);
          const rightImgView = this.createImageView(extProps.symbolRight);

          // Main View
          const mainLayout = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                          android.widget.LinearLayout.LayoutParams.MATCH_PARENT);
          const mainView = new android.widget.LinearLayout(this._androidcontext);

          mainView.setLayoutParams(mainLayout);
          mainView.setOrientation(android.widget.LinearLayout.HORIZONTAL);
          mainView.setBackground(this.getGradientDrawable(SafetyLabel.DEFAULT_BG_COLOR));
          mainView.addView(leftImgView);
          mainView.addView(leftLineView);
          mainView.addView(midView);
          mainView.addView(rightLineView);
          mainView.addView(rightImgView);

          // Control View
          const layout = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                      android.widget.LinearLayout.LayoutParams.MATCH_PARENT);

          this._view = new android.widget.LinearLayout(this._androidcontext);
          this._view.setLayoutParams(layout);
          this._view.setPadding(hortPaddingInPx, vertPaddingInPx, hortPaddingInPx, vertPaddingInPx);
          this._view.addView(mainView);
          this.setNativeView(this._view);

          return this._view;
        }

        initNativeView(): void {
            (<any>this._view).owner = this;
            super.initNativeView();
        }

        disposeNativeView(): void {
            (<any>this._view).owner = null;
        }

        public getView(): any {
            return this._view;
        }

        private createTitleView(extProps: any): any {
            const [ textColor, bgColor ] = this.getTitleColor(extProps.signalWord.toUpperCase());
            const titleLayout = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, 0, 0.3);
            const titleView = new android.widget.TextView(this._androidcontext);

            titleView.setBackgroundColor(bgColor);
            titleView.setTextSize(this.getTitleSize());
            titleView.setTextColor(textColor);
            titleView.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
            titleView.setText(extProps.headerCaption);
            titleView.setGravity(android.view.Gravity.CENTER);
            titleView.setMaxLines(1);
            titleView.setLayoutParams(titleLayout);

            return titleView;
        }

        private createMsgView(extProps: any): any {
            const msgLayout = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                           android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
            const msgView = new android.widget.TextView(this._androidcontext);

            msgView.setTextSize(this.getMsgSize());
            msgView.setTextColor(android.graphics.Color.parseColor(SafetyLabel.DEFAULT_TEXT_COLOR));
            msgView.setText(extProps.descriptionCaption);
            msgView.setPadding(5, 5, 5, 5);
            msgView.setMaxLines(4);
            msgView.setLayoutParams(msgLayout);

            // TODO: Looks like MDK does not allow extension control to handle vertical scroll event?
            const scrollLayout = new android.widget.LinearLayout.LayoutParams(android.widget.LinearLayout.LayoutParams.MATCH_PARENT, 0, 0.7);
            const scrollView  = new android.widget.ScrollView(this._androidcontext);

            scrollView.addView(msgView);
            scrollView.setLayoutParams(scrollLayout);

            return scrollView;
        }

        private createImageView(imgData: string): any {
            const base64 = android.util.Base64.decode(imgData.substring(SafetyLabel.IMG_METADATA.length),
                                                      android.util.Base64.DEFAULT);
            const bitmap = android.graphics.BitmapFactory.decodeByteArray(base64, 0, base64.length);

            const imgLayout = new android.widget.LinearLayout.LayoutParams(0, android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                                                                           this.isTablet() ? 0.1 : 0.15);
            const imgView = new android.widget.ImageView(this._androidcontext);

            imgView.setImageBitmap(bitmap);
            imgView.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
            imgView.setPadding(10, 10, 10, 10);
            imgView.setLayoutParams(imgLayout);

            return imgView;
        }

        private createLineView(isVertical: boolean): any {
            const lineLayout = new android.widget.LinearLayout.LayoutParams(
                                    isVertical ? android.widget.LinearLayout.LayoutParams.MATCH_PARENT : 2,
                                    isVertical ? 2 : android.widget.LinearLayout.LayoutParams.MATCH_PARENT);
            const lineView = new android.widget.TextView(this._androidcontext);
            lineView.setBackgroundColor(android.graphics.Color.parseColor(SafetyLabel.DEFAULT_TEXT_COLOR));
            lineView.setLayoutParams(lineLayout);

            return lineView;
        }

        private getPadding() {
            return this.isTablet() ? 24 : 16;
        }
  
        private getTitleSize() {
            return this.isTablet() ? 20 : 16;
        }

        private getMsgSize() {
            return this.isTablet() ? 18 : 14;
        }

        private isTablet(): boolean {
            return Device.deviceType === 'Tablet';
        }

        private getGradientDrawable(color: string): any {
            const gd = new android.graphics.drawable.GradientDrawable();

            gd.setColor(android.graphics.Color.parseColor(color));
            gd.setStroke(2, android.graphics.Color.parseColor(SafetyLabel.DEFAULT_TEXT_COLOR));

            return gd;
        }

        private getTitleColor(key: String): [number, number] {
            var textColor = SafetyLabel.DEFAULT_BG_COLOR;
            var bgColor = SafetyLabel.DEFAULT_TEXT_COLOR;

            switch (key) {
              case 'WARNING':
                  bgColor = '#c35500';
                  break;
              case 'SAFETYINSTRUCTIONS':
                  bgColor = '#256f3c';
                  break;
              case 'CAUTION':
                  textColor = '#223548';
                  bgColor = '#ffc933';
                  break;
              case 'NOTICE':
                  bgColor = '#0040b0';
                  break;
              case 'DANGER':
                  bgColor = '#d20a0a';
                  break;
              default:
                  break;
            }

            return [
                android.graphics.Color.parseColor(textColor),
                android.graphics.Color.parseColor(bgColor)
            ];
        }
    }

    return SafetyLabel;
}
