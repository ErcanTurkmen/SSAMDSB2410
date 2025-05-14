import { BaseControl } from 'mdk-core/controls/BaseControl';
import { SafetyLabel } from './SafetyLabelPlugin/SafetyLabel'

export class SafetyLabelClass extends BaseControl {
  private _labelContainer: SafetyLabel;

    public initialize(props) {
        super.initialize(props);
        this.createControl();
        this.setView(this._labelContainer.getView());
    }

    private createControl() {
        this._labelContainer = new SafetyLabel(this.androidContext(), this.context, this);
        this._labelContainer.initNativeView();
    }

    // Override
    protected createObservable() {
        return super.createObservable();
    }

    public viewIsNative() {
        return true;
    }
}