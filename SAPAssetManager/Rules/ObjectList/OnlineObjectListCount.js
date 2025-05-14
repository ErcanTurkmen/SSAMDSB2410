import CommonLibrary from '../Common/Library/CommonLibrary';

export default function OnlineObjectListCount(context) {
    const binding = context.getPageProxy().binding;
    return CommonLibrary.getEntitySetCount(context, binding['@odata.readLink'] + '/ObjectList', '', '/SAPAssetManager/Services/OnlineAssetManager.service');
}
