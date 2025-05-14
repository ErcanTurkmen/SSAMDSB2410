import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import SafetyCertificatesLibrary from '../SafetyCertificatesLibrary';

export default function IsLotoCertificate(context) {
    const safetyCertificates = context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentSafetyCertificatesODataType.global').getValue();
    const cert = context.getPageProxy().binding;
    return cert?.['@odata.type'] === safetyCertificates ?
        getDocumentUsages(context, cert).then(usage => SafetyCertificatesLibrary.LOTOCertificateUsageTypes.includes(usage?.Specification)) :
        Promise.resolve(false);
}

function getDocumentUsages(context, /** @type {WCMDocumentHeader} */ binding) {
    return ValidationLibrary.evalIsEmpty(binding?.WCMDocumentUsages) ?
        context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMDocumentUsages`, [], '')
            .then(result => !ValidationLibrary.evalIsEmpty(result) && result.getItem(0)) :
        Promise.resolve(binding.WCMDocumentUsages);
}
