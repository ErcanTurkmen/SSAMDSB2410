import libCommon from '../../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeLAM(context) {
    const timeData = WorkOrderCompletionLibrary.getStep(context, 'time');

    if (WorkOrderCompletionLibrary.isStepDataExist(context, 'lam')) {
        libCommon.setStateVariable(context, 'TransactionType', 'UPDATE');
        context.getPageProxy().setActionBinding( WorkOrderCompletionLibrary.getStepData(context, 'lam'));
        return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
    } else if (timeData && timeData.lam) {
        libCommon.setStateVariable(context, 'LAMDefaultRow', JSON.parse(timeData.lam));
        libCommon.setStateVariable(context, 'LAMCreateType', 'Confirmation');
        libCommon.setStateVariable(context, 'LAMConfirmationReadLink', timeData.link);
        libCommon.setStateVariable(context, 'TransactionType', 'CREATE');
    
        return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
    }
}
