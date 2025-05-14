import SysCompQueryptions from '../UserProfile/SysCompQueryptions';

export default function NavToAboutPage(context) {
    let page = context
        .getPageProxy()
        .getPageDefinition(
            '/SAPAssetManager/Pages/User/About.page',
        );
    const query = SysCompQueryptions(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserSystemInfos', [], query).then(function(results) {
        if (results && results.length) {
            let keysValuesArray = [];
            for (let i = 0; i < results.length; i++) {
                const item = results.getItem([i]);
                keysValuesArray.push({
                    KeyName: item.SystemSettingName,
                    Value: item.SystemSettingValue,
                });
            }
            if (keysValuesArray.length) {
                page.Controls[0].Sections.splice(1, 0, {
                    _Type: 'Section.Type.KeyValue',
                    _Name: 'syscomponentsection',
                    Visible: '/SAPAssetManager/Rules/UserProfile/BackendComponentInfoVisibility.js',
                    Header: {
                        UseTopPadding: true,
                        Caption: '$(L, backend_sys_comp)',
                    },
                    KeyAndValues: keysValuesArray,
                    Layout: {
                        NumberOfColumns: 1,
                    },
                });
            }
        }
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/User/NavToAboutPage.action',
            'Properties': {
                'PageMetadata': page,
            },
        });
    });
}
