import libCommon from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';

export default function LAMValuesCreateUpdateOnSave(pageProxy) {
    let onCreate = libCommon.IsOnCreate(pageProxy);

    if (onCreate) {
        let type = libCommon.getStateVariable(pageProxy, 'LAMCreateType');
        if (type === 'MeasurementPoint') {
            libCommon.setStateVariable(pageProxy, 'ObjectCreatedName', 'MeasurementPoint');
            return pageProxy.executeAction('/SAPAssetManager/Actions/LAM/LAMMeasurementPointDataCreate.action');
        } else if (type === 'Confirmation') {
            libCommon.setStateVariable(pageProxy, 'ObjectCreatedName', 'Confirmation');
            if (IsCompleteAction(pageProxy)) {
                return pageProxy.executeAction({'Name': '/SAPAssetManager/Actions/LAM/LAMConfirmationDataCreate.action', 
                    'Properties': {'OnSuccess': ''},
                }).then(result => {
                    WorkOrderCompletionLibrary.updateStepState(pageProxy, 'lam', {
                        link: JSON.parse(result.data)['@odata.editLink'],
                        value: pageProxy.localizeText('done'),
                        data: result.data,
                    });
                    return WorkOrderCompletionLibrary.getInstance().openMainPage(pageProxy);
                });
            }
            return pageProxy.executeAction('/SAPAssetManager/Actions/LAM/LAMConfirmationDataCreate.action');
        }
    } else {
        if (IsCompleteAction(pageProxy)) { 
            return pageProxy.executeAction( {'Name': '/SAPAssetManager/Actions/LAM/LAMDataUpdate.action', 
                'Properties': {'OnSuccess': ''},
            }).then(result => {
                WorkOrderCompletionLibrary.updateStepState(pageProxy, 'lam', {
                    link: JSON.parse(result.data)['@odata.editLink'],
                    value: pageProxy.localizeText('done'),
                    data: result.data,
                });
                return WorkOrderCompletionLibrary.getInstance().openMainPage(pageProxy);
            });
        }
        return pageProxy.executeAction('/SAPAssetManager/Actions/LAM/LAMDataUpdate.action');
    }

}
