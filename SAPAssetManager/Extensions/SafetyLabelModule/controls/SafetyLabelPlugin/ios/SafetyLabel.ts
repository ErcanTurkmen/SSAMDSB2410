import { View, Application, Device } from '@nativescript/core';

/*
  This is a way to keep iOS and Android implementation of your extension separate
  You will encapsulate the SafetyLabel class definition inside a function called GetSafetyLabelClass.
  This is so that the class definition won't be executed when you load this javascript
  via require function.
  The class definition will only be executed when you execute SafetyLabel.
*/
export function GetSafetyLabelClass() {

    class SafetyLabel extends View {
        private _layout;
        private _label;
        private _context;
        private _baseControl;

        public constructor(contextAndroid: any, context: any, baseControl: any) {
            super();
            this._context = context;
            this._baseControl = baseControl;
            this.createNativeView();
        }

        public createNativeView(): Object {
            this._layout = new UIStackView();
            this._layout.autoresizingMask = [UIViewAutoresizing.FlexibleHeight, UIViewAutoresizing.FlexibleWidth];
            this._layout.axis = UILayoutConstraintAxisHorizontal;
            this._layout.spacing = 0;
            this._layout.layoutMarginsRelativeArrangement = true;
            let inset = new NSDirectionalEdgeInsets();
            inset.top = 10;
            inset.bottom = 10;
            this._layout.directionalLayoutMargins = inset;
            this._layout.alignment = UIStackViewAlignmentFill;
            this._layout.distribution = UIStackViewDistributionFillEqually;

            let leftImageRaw, rightImageRaw, headerCaption = '', descriptionCaption = '';
            let boldFont;
            let captionBackgroundColor;
            let whiteColor = UIColor.whiteColor;
            let blackColor = UIColor.black;

            const isTablet = Device.deviceType === 'Tablet';

            if (isTablet) {
                boldFont = UIFont.boldSystemFontOfSize(20);
            } else {
                boldFont = UIFont.boldSystemFontOfSize(14);
            }

            let extProps = this._baseControl.definition().data.ExtensionProperties;
            if (extProps) {
                if (extProps.symbolLeft) {
                    leftImageRaw = extProps.symbolLeft;
                }
                if (extProps.symbolRight) {
                    rightImageRaw = extProps.symbolRight;
                }
                if (extProps.headerCaption) {
                    headerCaption = extProps.headerCaption;
                }
                if (extProps.descriptionCaption) {
                    descriptionCaption = extProps.descriptionCaption;
                }
                if (extProps.signalWord) { // Set the caption colors based on type.
                    switch (extProps.signalWord.toUpperCase()) {
                        case 'DANGER':
                            captionBackgroundColor = UIColor.colorWithRedGreenBlueAlpha(210.0/255.0, 10.0/255.0, 10.0/255.0, 1.0);
                            break;
                        case 'WARNING':
                            captionBackgroundColor = UIColor.colorWithRedGreenBlueAlpha(195.0/255.0, 85.0/255.0, 0.0/255.0, 1.0);
                            break;
                        case 'SAFETYINSTRUCTIONS':
                            captionBackgroundColor = UIColor.colorWithRedGreenBlueAlpha(37.0/255.0, 111.0/255.0, 58.0/255.0, 1.0);
                            break;
                        case 'CAUTION':
                            captionBackgroundColor = UIColor.colorWithRedGreenBlueAlpha(255.0/255.0, 201.0/255.0, 51.0/255.0, 1.0);
                            break;
                        case 'NOTICE':
                            captionBackgroundColor = UIColor.colorWithRedGreenBlueAlpha(0.0/255.0, 64.0/255.0, 176.0/255.0, 1.0);
                            break;
                        default:
                            break;
                    }
                }

                let imageInsets = UIEdgeInsets.Zero;

                // Create the left image and it's corresponding view.
                let leftImageView = new UIImageView();
                if (leftImageRaw) {
                    let leftImageURL = NSURL.URLWithString(leftImageRaw);
                    let leftImageData = NSData.dataWithContentsOfURL(leftImageURL);
                    let leftImage = UIImage.imageWithData(leftImageData);
                    leftImageView.contentMode = UIViewContentModeScaleAspectFit;
                    leftImageView.image = leftImage.imageWithAlignmentRectInsets(imageInsets);
                    leftImageView.layer.borderWidth = 1.5;
                    leftImageView.layer.borderColor = blackColor;
                }

                // Create the right image and it's corresponding view.
                let rightImageView = new UIImageView();
                if (rightImageRaw) {
                    let rightImageURL = NSURL.URLWithString(rightImageRaw);
                    let rightImageData = NSData.dataWithContentsOfURL(rightImageURL);
                    let rightImage = UIImage.imageWithData(rightImageData);
                    rightImageView.contentMode = UIViewContentModeScaleAspectFit;
                    rightImageView.image = rightImage.imageWithAlignmentRectInsets(imageInsets);
                    rightImageView.layer.borderWidth = 1.5;
                    rightImageView.layer.borderColor = blackColor;
                }

                // Create the center vertical stack view.
                let verticalStackView = new UIStackView();
                verticalStackView.axis = UILayoutConstraintAxis.Vertical;
                verticalStackView.spacing = 0;

                // Create the header caption label.
                let headerCaptionLabel = new UILabel();
                headerCaptionLabel.text = headerCaption;
                headerCaptionLabel.font = boldFont;
                headerCaptionLabel.textColor = whiteColor;
                headerCaptionLabel.backgroundColor = captionBackgroundColor;
                headerCaptionLabel.textAlignment = NSTextAlignmentCenter;
                headerCaptionLabel.numberOfLines = 1;
                headerCaptionLabel.allowsDefaultTighteningForTruncation = true;
                headerCaptionLabel.layer.borderWidth = 1.5;
                headerCaptionLabel.layer.borderColor = blackColor;

                // Create the description caption view for the label.
                let descriptionCaptionView = new UITextView();
                descriptionCaptionView.text = descriptionCaption;
                descriptionCaptionView.font = boldFont;
                descriptionCaptionView.editable = false;
                descriptionCaptionView.layer.borderWidth = 1.5;
                descriptionCaptionView.layer.borderColor = blackColor;

                // Add the subviews to the center stack view.
                verticalStackView.addArrangedSubview(headerCaptionLabel);
                verticalStackView.addArrangedSubview(descriptionCaptionView);

                // Add the left, center, and right views to the main stackview.
                this._layout.addArrangedSubview(leftImageView);
                this._layout.addArrangedSubview(verticalStackView);
                this._layout.addArrangedSubview(rightImageView);

                this.setNativeView(this._layout);

                return this._layout;
            }
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

    }
    return SafetyLabel;
}
