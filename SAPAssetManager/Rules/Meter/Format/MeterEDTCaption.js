import MeterSectionInstallUninstallEntitySet from '../MeterSectionInstallUninstallEntitySet';

export default function MeterEDTCaption(context) {
    let entitySet = MeterSectionInstallUninstallEntitySet(context);
    let filterString = '$filter=sap.entityexists(Device_Nav)';

    return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, filterString).then(result => {
        if (result > 0) {
            return context.localizeText('meters_x', [result]);
        } else {
            return context.localizeText('meters_x', 0);
        }
    });
}
