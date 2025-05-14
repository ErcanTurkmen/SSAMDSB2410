import IsAndroid from '../Common/IsAndroid';
import MeterSectionInstallUninstallEntitySet from './MeterSectionInstallUninstallEntitySet';
import MeterSectionInstallUninstallQueryOptions from './MeterSectionInstallUninstallQueryOptions';

export default function MeterSectionInstallUninstallPageMetadata(context) {
    const page = context.getPageDefinition('/SAPAssetManager/Pages/WorkOrders/Meter/MetersListViewWithActivity.page');
    const sectionTable = page.Controls[0];
    const edtSection = sectionTable.Sections[0];
    
    // reset back target as it cached by EDT extension
    edtSection.ExtensionProperties.Target = {
        'EntitySet': '/SAPAssetManager/Rules/Meter/MeterSectionInstallUninstallEntitySet.js',
        'Service': '/SAPAssetManager/Services/AssetManager.service',
        'QueryOptions': '/SAPAssetManager/Rules/Meter/MeterSectionInstallUninstallQueryOptions.js',
    };

    return modifyUninstallMeterEDTTable(context, page);
}

// calculate EDT table height
export function modifyUninstallMeterEDTTable(clientAPI, page) {
    const uninstallMeterSection = page.Controls[0].Sections.find(section => section._Name === 'EditableDataTableExtensionSection');

    if (uninstallMeterSection) {
        const entitySet = MeterSectionInstallUninstallEntitySet(clientAPI);
        const query = MeterSectionInstallUninstallQueryOptions(clientAPI);
        return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', entitySet, query).then(count => {
            if (count > 0) {
                if (IsAndroid(clientAPI)) {
                    const rowHight = 110;
                    uninstallMeterSection.Height = 80 + (count * rowHight);
                } else {
                    const rowHight = 95;
                    uninstallMeterSection.Height = 60 + (count * rowHight);
                }
            }
            return Promise.resolve(page);
        })
        .catch(() => {
            return Promise.resolve(page);
        });
    }

    return Promise.resolve(page);
}
