import { WCMDocumentItemMobileStatusType } from '../../OperationalItems/libWCMDocumentItem';
import { GetMobileStatusLabelOrEmpty } from './GetMobileStatusLabelOrEmpty';

export default function MobileStatusTagText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TagParameterName.global').getValue(), WCMDocumentItemMobileStatusType);
}
