import { WCMDocumentItemMobileStatusType } from '../../OperationalItems/libWCMDocumentItem';
import { GetMobileStatusLabelOrEmpty } from './GetMobileStatusLabelOrEmpty';

export default function MobileStatusInitialStatusText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/InitialStatusParameterName.global').getValue(), WCMDocumentItemMobileStatusType);
}
