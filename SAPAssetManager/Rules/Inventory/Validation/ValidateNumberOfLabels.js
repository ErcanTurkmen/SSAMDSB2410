import libCom from '../../Common/Library/CommonLibrary';
import { validateNumberOfLabels } from './ValidateIssueOrReceipt';

export default function ValidateNumberOfLabels(context) {
    validateNumberOfLabels(context.getPageProxy(), context).then(() => {
        libCom.clearValidationOnInput(context);
    });
}
