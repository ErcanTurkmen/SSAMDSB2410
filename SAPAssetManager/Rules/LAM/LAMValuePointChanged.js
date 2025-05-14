
import libCom from '../Common/Library/CommonLibrary';
import libLocal from '../Common/Library/LocalizationLibrary';
import ResetValidationOnInput from '../Common/Validation/ResetValidationOnInput';
import StartValidation from './CreateUpdate/ValidationRules/StartValidation';

export default function LAMValuePointChanged(context) {
    ResetValidationOnInput(context);

    const pageProxy = context.getPageProxy(context);
    const controls = libCom.getControlDictionaryFromPage(pageProxy);
    let start = libCom.getFieldValue(pageProxy, 'StartPoint');
    let end = libCom.getFieldValue(pageProxy, 'EndPoint');
    let length = 0;

    if (libLocal.isNumber(context, start) && libLocal.isNumber(context, end)) {
        length = Math.abs(libLocal.toNumber(context, end) - libLocal.toNumber(context, start));
        controls.Length.setValue(context.formatNumber(length, '',{useGrouping : false}), false);
    } 
    
    StartValidation(context, controls.StartPoint, start, end); 
}
