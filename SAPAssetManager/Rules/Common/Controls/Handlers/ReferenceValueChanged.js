import { EquipmentCreateUpdateLibrary } from '../../../Equipment/EquipmentCreateUpdateLibrary';
import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../../../FunctionalLocation/FunctionalLocationLibrary';
import CommonLibrary from '../../Library/CommonLibrary';
import ResetValidationOnInput from '../../Validation/ResetValidationOnInput';

export default function ReferenceValueChanged(control) {
    let pageProxy= control.getPageProxy();
    let object = control.getValue();
    let isFLOCPage = CommonLibrary.getCurrentPageName(control) === 'FunctionalLocationCreateUpdatePage';
    let entitySet = isFLOCPage ? 'MyFunctionalLocations' : 'MyEquipments';
    
    if (object) {
        control.read('/SAPAssetManager/Services/AssetManager.service', `${entitySet}('${object[0].ReturnValue}')`, [], '$expand=Location_Nav').then(response => { 
            if (response && response.length > 0) {
                let referencedObject = response.getItem(0);
                if (isFLOCPage) {
                    libFLOC.setValues(pageProxy, referencedObject);
                } else {
                    EquipmentCreateUpdateLibrary.setValues(pageProxy, referencedObject);
                }
            }
        });
    }

    ResetValidationOnInput(control);
}
