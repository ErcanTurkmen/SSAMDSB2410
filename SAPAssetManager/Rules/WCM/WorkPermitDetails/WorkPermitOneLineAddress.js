import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function WorkPermitOneLineAddress(context) {
    const wcmObject = context.binding;  // WCMApplication || WCMDocumentHeader || WCMDocumentItem
    return Promise.all(['MyEquipments', 'MyFunctionalLocations'].map(navProp => context.read('/SAPAssetManager/Services/AssetManager.service', `${wcmObject['@odata.readLink']}/${navProp}`, [], '$expand=Address')))
        .then(addresses => {
            const equipmentOrFuncLoc = addresses.find(addressOrEmpty => !ValidationLibrary.evalIsEmpty(addressOrEmpty));
            const address = equipmentOrFuncLoc ? equipmentOrFuncLoc.getItem(0).Address : undefined;
            return address ? CommonLibrary.oneLineAddress(address) : context.localizeText('no_address_available');
        });
}
