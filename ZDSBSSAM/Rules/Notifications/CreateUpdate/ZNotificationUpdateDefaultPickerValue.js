export default async function ZNotificationUpdateDefaultPickerValue(context) {
    if (context.binding['@odata.readLink']) {
        let itemData = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Items', [], '');
        let aPath = `MyNotificationItems(ItemNumber='0001',NotificationNumber='${context.binding.NotificationNumber}')/ItemCauses`;
        let causeData = await context.read('/SAPAssetManager/Services/AssetManager.service', aPath, [], '')
        switch (context.getName()) {
            case 'PartGroupLstPkr':
                return itemData.getItem(0).ObjectPartCodeGroup || '';
            case 'PartDetailsLstPkr':
                return itemData.getItem(0).ObjectPart || '';
            default:
                return '';
        }
    }
    else {
        return '';
    }
}
