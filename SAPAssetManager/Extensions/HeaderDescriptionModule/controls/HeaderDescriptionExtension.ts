import { BaseControl } from 'mdk-core/controls/BaseControl';
import { HeaderDescription } from './HeaderDescriptionPlugin/HeaderDescription'

export class HeaderDescriptionClass extends BaseControl {
  private _headerDescriptionContainer: HeaderDescription;

  public initialize(props) {
    super.initialize(props);

    this.createHeaderDescriptionControl();
    this.setView(this._headerDescriptionContainer.getView());
  }

  private createHeaderDescriptionControl() {
    this._headerDescriptionContainer = new HeaderDescription(this.androidContext());
    let controlPromises = [];

    let extProps = this.definition().data.ExtensionProperties;
    if (extProps && extProps.Title) {
      controlPromises.push(this.valueResolver().resolveValue(extProps.Title, this.context, true));
      if(extProps.Description) {
          controlPromises.push(this.valueResolver().resolveValue(extProps.Description, this.context, true));
      }
      Promise.all(controlPromises).then(results => {
        if (results) {
          let headerText = results[0];
          let descriptionText = "";
          if(results.length > 1) {
            descriptionText = results[1];
          }
          this._headerDescriptionContainer.addControls(headerText, descriptionText);
        }
      });
    }

    this._headerDescriptionContainer.initNativeView();
  }

  protected createObservable() {
    return super.createObservable();
  }

  public viewIsNative() {
    return true;
  }
}