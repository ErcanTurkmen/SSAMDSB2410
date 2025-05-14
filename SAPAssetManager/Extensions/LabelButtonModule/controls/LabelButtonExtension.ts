import { BaseControl } from 'mdk-core/controls/BaseControl';
import { LabelButton } from './LabelButtonPlugin/LabelButton'

export class LabelButtonClass extends BaseControl {
  private _labelButtonContainer: LabelButton;

  public initialize(props) {
    super.initialize(props);

    this.createLabelButtonControl();
    this.setView(this._labelButtonContainer.getView());
  }

  private createLabelButtonControl() {
    this._labelButtonContainer = new LabelButton(this.androidContext());
    let controlPromises = [], buttonProperties;

    let extProps = this.definition().data.ExtensionProperties;
    if (extProps && extProps.Label) {
      controlPromises.push(this.valueResolver().resolveValue(extProps.Label, this.context, true));
      if(extProps.Button) {
        buttonProperties = JSON.parse(JSON.stringify(extProps.Button));
        if(buttonProperties.Title) {
          controlPromises.push(this.valueResolver().resolveValue(buttonProperties.Title, this.context, true));
          Promise.all(controlPromises).then(([labelText, title]) => {
            buttonProperties.Title = title;
            this._labelButtonContainer.addControls(labelText, buttonProperties);
          });
        }
      }
    }

    this._labelButtonContainer.initNativeView();

    this._labelButtonContainer.on("OnButtonClick", function(eventData){
      if (eventData.value.OnPress) {
        return this.executeAction(eventData.value.OnPress);
      }      
    }.bind(this));
  }

  protected createObservable() {
    return super.createObservable();
  }

  public viewIsNative() {
    return true;
  }
}