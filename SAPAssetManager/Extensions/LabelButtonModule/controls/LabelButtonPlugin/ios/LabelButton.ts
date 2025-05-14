import { View, Application, Device } from '@nativescript/core';

/*
  This is a way to keep iOS and Android implementation of your extension separate
  You will encapsulate the LabelButton class definition inside a function called GetLabelButtonClass
  This is so that the class definition won't be executed when you load this javascript
  via require function.
  The class definition will only be executed when you execute GetLabelButtonClass
*/

export function GetLabelButtonClass() {

    const defaultTintColorLabel = UIColor.colorWithRedGreenBlueAlpha(81.0/255.0, 85.0/255.0, 89.0/255.0, 1.0);
    const defaultTintColorButton = UIColor.colorWithRedGreenBlueAlpha(10.0/255.0, 110.0/255.0, 209.0/255.0, 1.0);
    const darkModeTintColorLabel = UIColor.colorWithRedGreenBlueAlpha(1.0, 1.0,1.0, 1.0);

    function isTablet() {
        return Device.deviceType === 'Tablet';
    }

    function isSystemAppearanceDark() {
        return Application.systemAppearance() === 'dark';
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

    @NativeClass()
    class ButtonHandler extends NSObject {

        private _owner: any; 

        static new(): ButtonHandler {
            return <ButtonHandler> super.new();
        }

        initWithOwner(owner: any): ButtonHandler {
            this._owner = owner;
            return this;
        }
       
        public buttonClick(nativeButton: UIButton, nativeEvent: _UIEvent) {       
            const owner = this._owner;   
            if (owner) {
                nativeButton.setSelected = true;     
                owner.toggleButton();
                const eventData = {
                    eventName: "OnButtonClick",
                    object: owner,
                    value: owner.getButton()
                };
                owner.notify(eventData);
            }
        }

        public static ObjCExposedMethods = {
            "buttonClick": { returns: interop.types.void, params: [interop.types.id, interop.types.id] }
        };
    }

    class LabelButton extends View {
        private _layout;
        private _label;
        private _button;
        private _buttonHandler;

        public constructor(context: any) {
            super();
            this._buttonHandler = ButtonHandler.new().initWithOwner(this);
            this.createNativeView();
        }

        public createNativeView(): Object {

            this._layout = UIStackView.new();
            this._layout.autoresizingMask = [UIViewAutoresizing.FlexibleHeight, UIViewAutoresizing.FlexibleWidth];
            this._layout.layoutMarginsRelativeArrangement = true;
            this._layout.axis = UILayoutConstraintAxisHorizontal;
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

        private createLabel(labeltext: string): UILabel {
            let label = new UILabel();
            label.text = labeltext;
            label.font = UIFont.systemFontOfSize(14);
            label.textColor = this.getLabelColor();
            return label;
        }

        private getLabelColor() {
            if(isSystemAppearanceDark()) {
                return darkModeTintColorLabel;
            }
            return defaultTintColorLabel;
        }

        private createButton(buttonProps: any): UIButton {
            let button = UIButton.buttonWithType(UIButtonTypeSystem);
            button.setTitleForState(buttonProps.Title, UIControlState.Normal);
            button.addTargetActionForControlEvents(this._buttonHandler, "buttonClick", UIControlEvents.UIControlEventTouchUpInside);
            button.titleLabel.font = UIFont.fontWithNameSize("SFProText-Regular", 14);
            button.titleLabel.textAlignment = NSTextAlignmentRight;
            button.setTitleColorForState(defaultTintColorButton, UIControlStateNormal);
            button.OnPress = buttonProps.OnPress;
            button._toggleValue = buttonProps.ToggleValue;
            return button;
        }

        private createSpaceView() : UIStackView {
            let space = UIStackView.new();
            space.distribution = UIStackViewDistributionFill;
            return space;
        }

        public addControls(label: string, buttonProps: any) {
            this._label = this.createLabel(label);
            const spaceView = this.createSpaceView();
            this._button = this.createButton(buttonProps);
            
            this._layout.addArrangedSubview(this._label);
            this._layout.addArrangedSubview(spaceView);
            this._layout.addArrangedSubview(this._button);
        }

        public setLabelText(labelText: string) {
            if(this._label) {
                this._label.text = labelText;
            }
        }

        public setButtonTitle(title: string) {
            if (this._button) {
                this._button.setTitleForState(title, UIControlState.Normal);
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