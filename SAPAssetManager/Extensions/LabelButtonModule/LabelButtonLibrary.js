export default class {
    static getButtonState(context) {
      return context?._control?._labelButtonContainer?.getButtonState();
    }
 
    static setButtonTitle(context, title) {
      context?._control?._labelButtonContainer?.setButtonTitle(title);
    }
 
    static setLabelText(context, labeltext) {
      context?._control?._labelButtonContainer?.setLabelText(labeltext);
    }

    static toggleButton(context) {
      context?._control?._labelButtonContainer?.toggleButton();
    }
 }
