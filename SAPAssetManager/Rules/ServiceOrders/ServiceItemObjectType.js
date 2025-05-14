import MobileStatusLocalServiceItemReadLink from '../MobileStatus/MobileStatusLocalServiceItemReadLink';

export default function ServiceItemObjectType(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', MobileStatusLocalServiceItemReadLink(context), ['ItemObjectType'], '').then(result => {
        return result.getItem(0).ItemObjectType || '';
    });
}
