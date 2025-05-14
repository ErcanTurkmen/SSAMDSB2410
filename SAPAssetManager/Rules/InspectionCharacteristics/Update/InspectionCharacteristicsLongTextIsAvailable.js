
import libCom from '../../Common/Library/CommonLibrary';
export default function InspectionCharacteristicsLongTextIsAvailable(context) {
    let binding = context.binding;

    return libCom.isDefined(binding?.MasterInspCharLongText_Nav?.TextString);
}
