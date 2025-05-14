import IsPhaseModelEnabled from '../../../Common/IsPhaseModelEnabled';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function WorkOrderOperationsTypeValueChanged(context) {
    let values = context.getValue();
    let phaseFilterControl = context.getPageProxy().getControl('FormCellContainer').getControl('PhaseFilter');
    let phaseControlFilterControl = context.getPageProxy().getControl('FormCellContainer').getControl('PhaseControlFilter');

    RedrawFilterToolbar(context);
    
    if (IsPhaseModelEnabled(context) && values && values.length) {
        let orderTypes = [];
        values.forEach(value => {
            orderTypes.push(`OrderType eq '${value.ReturnValue}'`);
        });

        let queryOptions = '$filter=(' + orderTypes.join(' or ') + ') and PhaseModelActive eq \'X\'';
        context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], queryOptions)
            .then(result => {
                let isPhaseType = result && !!result.length;
                phaseFilterControl.setVisible(isPhaseType);
                phaseControlFilterControl.setVisible(isPhaseType);

                if (!isPhaseType) {
                    phaseFilterControl.setValue('');
                    phaseControlFilterControl.setValue('');
                }
            }).catch(() => {
                phaseFilterControl.setVisible(false);
                phaseFilterControl.setValue('');
                phaseControlFilterControl.setVisible(false);
                phaseControlFilterControl.setValue('');
            });
    } else {
        phaseFilterControl.setVisible(false);
        phaseFilterControl.setValue('');
        phaseControlFilterControl.setValue('');
    }
}
