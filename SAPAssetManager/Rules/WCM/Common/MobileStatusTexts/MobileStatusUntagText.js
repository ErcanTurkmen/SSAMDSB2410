import { WCMDocumentItemMobileStatusType } from '../../OperationalItems/libWCMDocumentItem';
import { GetMobileStatusLabelOrEmpty } from './GetMobileStatusLabelOrEmpty';

export default function MobileStatusUntagText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntagParameterName.global').getValue(), WCMDocumentItemMobileStatusType);
}

