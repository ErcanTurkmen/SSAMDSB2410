import { WCMDocumentItemMobileStatusType } from '../../OperationalItems/libWCMDocumentItem';
import { GetMobileStatusLabelOrEmpty } from './GetMobileStatusLabelOrEmpty';

export default function MobileStatusTaggedText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue(), WCMDocumentItemMobileStatusType);
}
