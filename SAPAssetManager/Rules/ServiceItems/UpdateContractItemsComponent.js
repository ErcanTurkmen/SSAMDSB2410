import IsOnCreate from '../Common/IsOnCreate';
import CommonLibrary from '../Common/Library/CommonLibrary';
import ServiceContractItemQuery from './CreateUpdate/ServiceContractItemQuery';
import ServiceContractQuery from './CreateUpdate/ServiceContractQuery';

// Update service contract list (or service contract item) picker options based on selected values
export default function UpdateContractItemsComponent(control, parentServiceObjectId, srContract, type = 'item') {
    // setting service contract field as enabled if parent service object is selected
    if (IsOnCreate(control)) {
        const serviceObjectId = parentServiceObjectId || _getParentServiceObjectId(control.getPageProxy());
        const srContractId = srContract || CommonLibrary.getControlValue(CommonLibrary.getControlProxy(control.getPageProxy(), 'ServiceContractLstPkr'));
        switch (type) {
            case 'contract':
                return ServiceContractQuery(control, serviceObjectId).then(query => {
                    const entity = 'S4ServiceContracts';
                    const controlName = 'ServiceContractLstPkr';
                    return _updateListPickerParams(control, controlName, entity, query, CommonLibrary.isDefined(serviceObjectId));
                });
            case 'item':
            default:
                return ServiceContractItemQuery(control, serviceObjectId, srContractId).then(query => {
                    const entity = 'S4ServiceContractItems';
                    const controlName = 'ServiceContractItemLstPkr';
                    return _updateListPickerParams(
                        control,
                        controlName,
                        entity,
                        query,
                        CommonLibrary.isDefined(serviceObjectId) && CommonLibrary.isDefined(srContractId),
                    );
                });
        }
        
    }
    return Promise.resolve();
}

function _updateListPickerParams(context, controlName, entitySet, query, setEditable = false) {
    const controlListPicker = context.getPageProxy().getControl('FormCellContainer').getControl(controlName);
    const controlListPickerSpecifier = controlListPicker.getTargetSpecifier();
    controlListPickerSpecifier.setEntitySet(entitySet);
    controlListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    controlListPickerSpecifier.setQueryOptions(query);
    controlListPicker.setTargetSpecifier(controlListPickerSpecifier);
    controlListPicker.setValue('');
    controlListPicker.setEditable(setEditable);
    controlListPicker.redraw();
}

function _getParentServiceObjectId(context) {
    const serviceOrderLstPkr = CommonLibrary.getControlProxy(context, 'ServiceOrderLstPkr');
    const serviceQuotationLstPkr = CommonLibrary.getControlProxy(context, 'ServiceQuotationLstPkr');

    return CommonLibrary.getControlValue(serviceOrderLstPkr || serviceQuotationLstPkr);
}
