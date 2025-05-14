import libCom from '../../Common/Library/CommonLibrary';
import rejectNoteSave from '../Reject/RejectNoteSave';

export default function RejectSuccess(context) {
    
    let comment = libCom.getTargetPathValue(context, '#Control:LongTextNote/#Value');
    let pickerValue = libCom.getTargetPathValue(context, '#Control:ReasonLstPkr/#Value');
    let rejectionReasonCode = libCom.getListPickerValue(pickerValue);
    
    libCom.setStateVariable(context, 'RejectionReasonCode', rejectionReasonCode);
    libCom.setStateVariable(context, 'SupervisorRejectSuccess', true);
    if (comment) {
        return rejectNoteSave(context); //Save the reject comment
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');  //No comment, so just close the reject page
}
