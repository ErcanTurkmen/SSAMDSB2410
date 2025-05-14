import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function OnTimeSheetEntryNameChanged(context) {
    let pageProxy = context.getPageProxy();

    let nameLstPicker = libCom.getControlProxy(pageProxy, 'MemberLstPkr');
    /* Clear the validation if the field is not empty */
    ResetValidationOnInput(nameLstPicker);
}
