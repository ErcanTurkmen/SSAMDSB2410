import libCommon from '../../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import { EquipmentCreateUpdateLibrary } from '../../EquipmentCreateUpdateLibrary';

export default function TemplateValueChanged(context) {
    let pageProxy = context.getPageProxy();
    let objectSelected = false;
    let value = libCommon.getControlValue(context);

    if (value) {
        objectSelected = true;

        context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${value}')`, [], '').then(response => { 
            let referencedEquipment = response.getItem(0);

            EquipmentCreateUpdateLibrary.setValues(pageProxy, referencedEquipment);
        });
    }

    libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(objectSelected);
    ResetValidationOnInput(context);
}
