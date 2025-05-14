import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import RedrawFilterToolbar from '../../Filter/RedrawFilterToolbar';

export default function WorkOrderTypeValueChanged(context) {
    /** @type {Array<{DisplayValue: string, ReturnValue: string}>} */
    let values = context.getValue();
    let phaseFilterControl = context.getPageProxy().getControl('FormCellContainer').getControl('PhaseFilter');

    RedrawFilterToolbar(context);

    if (!IsPhaseModelEnabled(context) || ValidationLibrary.evalIsEmpty(values)) {
        ClearControl(phaseFilterControl);
        return undefined;
    }
    const orderTypes = values.map(v => `OrderType eq '${v.ReturnValue}'`);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=(${orderTypes.join(' or ')}) and PhaseModelActive eq 'X`)
        .then(result => {
            const isPhaseType = ValidationLibrary.evalIsEmpty(result);
            phaseFilterControl.setVisible(isPhaseType);

            if (!isPhaseType) {
                phaseFilterControl.setValue('');
            }
        }).catch(() => ClearControl(phaseFilterControl));
}

function ClearControl(control) {
    control.setVisible(false);
    control.setValue('');
}
