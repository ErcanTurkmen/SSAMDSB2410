import { View, Application, Device } from '@nativescript/core';

/*
  This is a way to keep iOS and Android implementation of your extension separate
  You will encapsulate the HeaderDescription class definition inside a function called GetHeaderDescriptionClass
  This is so that the class definition won't be executed when you load this javascript
  via require function.
  The class definition will only be executed when you execute GetHeaderDescriptionClass
*/

export function GetHeaderDescriptionClass() {

    function isTablet() {
        return Device.deviceType === 'Tablet';
    }

    function getHorizontalInset() {
        return isTablet() ? 24 : 3;
    }

    function getInsets() {
        let insets = new NSDirectionalEdgeInsets();

        let horizontalInset = getHorizontalInset();
        let verticalInset = 10;

        insets.leading = horizontalInset;
        insets.trailing = horizontalInset;
        insets.top = verticalInset;
        insets.bottom = verticalInset;

        return insets;
    }

    class HeaderDescription extends View {
        private _layout;
        private _header;
        private _description;

        public constructor(context: any) {
            super();
            this.createNativeView();
        }

        public createNativeView(): Object {

            this._layout = UIStackView.new();
            this._layout.autoresizingMask = [UIViewAutoresizing.FlexibleHeight, UIViewAutoresizing.FlexibleWidth];
            this._layout.layoutMarginsRelativeArrangement = true;
            this._layout.axis = UILayoutConstraintAxisVertical;
            this._layout.distribution = UIStackViewDistributionFill;
            this._layout.directionalLayoutMargins = getInsets();

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

        private createLabel(text:string, isBold: boolean, fontSize: Number) {
            let label = new UILabel();
            label.text = text;
            label.adjustsFontSizeToFitWidth = false;
            label.lineBreakMode = NSLineBreakByTruncatingTail;   
            if(isBold) {
                label.font = UIFont.boldSystemFontOfSize(fontSize);
            }
            else {
                label.font = UIFont.systemFontOfSize(fontSize);
            }
            return label;
        }

        private createSpaceView() : UIStackView {
            let space = UIStackView.new();
            space.distribution = UIStackViewDistributionFill;
            return space;
        }

        public addControls(headerText: string, descriptionText: string) {
            this._header = this.createLabel(headerText, true, 20);
            const spaceView = this.createSpaceView();
            this._description = this.createLabel(descriptionText, false, 14);
            
            this._layout.addArrangedSubview(this._header);
            this._layout.addArrangedSubview(spaceView);
            this._layout.addArrangedSubview(this._description);
        }

        public setHeader(headerText: string) {
            if(this._header) {
                this._header.text = headerText;
            }
        }

        public setDescription(descriptionText: string) {
            if(this._description) {
                this._description.text = descriptionText;
            }
        }
    }

    return HeaderDescription;
}