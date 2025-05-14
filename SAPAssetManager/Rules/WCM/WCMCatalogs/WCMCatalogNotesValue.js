import { ValueIfExists } from '../../Common/Library/Formatter';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function WCMCatalogNotesValue(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMCatalogLongtext`, [], '').then(wcmCatalogLongtext => {
        wcmCatalogLongtext = ValidationLibrary.evalIsEmpty(wcmCatalogLongtext) ? '' : wcmCatalogLongtext.getItem(0).TEXT_STRING;  // expecting a single element
        return ValueIfExists(wcmCatalogLongtext);
    });
}
