import libCommon from '../../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../../FunctionalLocationLibrary';

export default function TemplateValueChanged(context) {
    ResetValidationOnInput(context);
    let pageProxy = context.getPageProxy();
    let objectSelected = false;
    let noteControl = libCommon.getControlProxy(pageProxy, 'LongTextNote');
    let value = libCommon.getControlValue(context);

    if (value) {
        objectSelected = true;
        context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${value}')`, [], '').then(response => { 
            if (response && response.length > 0) {
                let referencedFLOC = response.getItem(0);

                libFLOC.setValues(pageProxy, referencedFLOC);
            }
        });
    } else {
        libCommon.setFormcellEditable(noteControl);
        libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue([]);
    }
    libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(objectSelected);
}
