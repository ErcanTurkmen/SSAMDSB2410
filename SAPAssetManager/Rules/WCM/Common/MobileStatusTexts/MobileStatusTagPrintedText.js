import { WCMDocumentItemMobileStatusType } from '../../OperationalItems/libWCMDocumentItem';
import { GetMobileStatusLabelOrEmpty } from './GetMobileStatusLabelOrEmpty';

export default function MobileStatusTagPrintedText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TagPrintedParameterName.global').getValue(), WCMDocumentItemMobileStatusType);
}
