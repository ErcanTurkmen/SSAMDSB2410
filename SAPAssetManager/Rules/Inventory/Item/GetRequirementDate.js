import libCom from '../../Common/Library/CommonLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetRequirementDate(context) {
    const binding = context.binding;
    if (binding?.RequirementDate) {
        const dateString = libCom.dateStringToUTCDatetime(binding.RequirementDate);
        const dateText = libCom.getFormattedDate(dateString, context);
        return dateText;
    } else {
        return ValueIfExists(binding?.RequirementDate);
    }
}
