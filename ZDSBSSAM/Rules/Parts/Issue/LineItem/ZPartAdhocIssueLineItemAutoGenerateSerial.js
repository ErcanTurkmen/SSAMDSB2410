import libVal from '../../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
export default function ZPartAdhocIssueLineItemAutoGenerateSerial(context) {
    let autoGenerateSwitch = context.evaluateTargetPath('#Control:AutoGenerateSerialNumberSwitch/#Value');
    if (!libVal.evalIsEmpty(context.binding.SerialNoProfile) && autoGenerateSwitch ) {
        return 'X';
    } else {
        return '';
    }
}
