import IsAndroid from '../Common/IsAndroid';

/**
 * Adds page elements to the user profile page based on the platform.
 * @param {IClientAPI} clientAPI
 */

export default function AddPlatformBasedElements(clientAPI) {
    const page = clientAPI
        .getPageProxy()
        .getPageDefinition(
            '/SAPAssetManager/Pages/User/UserProfileSettings.page',
        );
    if (IsAndroid(clientAPI)) {
        addAndroidOnlyElements(page);
    } else {
        addIOSOnlyElements(page);
    }
    return page;
}

function addAndroidOnlyElements(page) {
    addAndroidButtonTable(page);
    addAndroidToolbar(page);
}

function addAndroidToolbar(page) {
    let toolbar = page.FioriToolbar;
    toolbar.Items = [];
    toolbar.Items.push(
        {
            _Name: 'LogOutButton',
            _Type: 'FioriToolbarItem.Type.Button',
            Title: '$(L,logout)',
            ButtonType: 'Text',
            OnPress: '/SAPAssetManager/Rules/Common/LogOutAlertAction.js',
            Visible: '/SAPAssetManager/Rules/UserProfile/IsLogOutVisible.js',
        },
        {
            _Name: 'ProfileResetButton',
            _Type: 'FioriToolbarItem.Type.Button',
            Title: '$(L,reset)',
            ButtonType: 'Primary',
            Semantic: 'Negative',
            OnPress: '/SAPAssetManager/Rules/Common/ResetAlertAction.js',
        },
    );
}

function addAndroidButtonTable(page) {
    page.Controls[0].Sections.push({
        Header: {
            UseTopPadding: false,
            Caption: '/SAPAssetManager/Rules/Sync/LastSyncCaption.js',
        },
        Buttons: [
            {
                Title: '$(L,sync)',
                Style: 'FormCellButton',
                OnPress:
                    '/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnSync.js',
                TextAlignment: 'right',
            },
            {
                Title: '$(L,check_app_update)',
                Style: 'FormCellButton',
                OnPress: '/SAPAssetManager/Rules/Common/BeforeAppUpdate.js',
                TextAlignment: 'right',
            },
        ],
        _Type: 'Section.Type.ButtonTable',
    });
}

function addIOSOnlyElements(page) {
    page.Controls[0].Sections.push(
        {
            Footer: {
                Caption: '/SAPAssetManager/Rules/Sync/LastSyncCaption.js',
                FooterStyle: 'help',
                UseBottomPadding: false,
            },
            Buttons: [
                {
                    Title: '$(L,sync)',
                    Style: 'FormCellButton',
                    OnPress:
                        '/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnSync.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        },
        {
            Header: {
                UseTopPadding: false,
            },
            Buttons: [
                {
                    Title: '$(L,check_app_update)',
                    Style: 'FormCellButton',
                    OnPress:
                        '/SAPAssetManager/Rules/Common/BeforeAppUpdate.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        },
        {
            Header: {
                UseTopPadding: false,
            },
            Buttons: [
                {
                    Title: '$(L,logout)',
                    Style: 'FormCellButton',
                    OnPress:
                        '/SAPAssetManager/Rules/Common/LogOutAlertAction.js',
                    Visible:
                        '/SAPAssetManager/Rules/UserProfile/IsLogOutVisible.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        },
        {
            Header: {
                UseTopPadding: false,
            },
            Buttons: [
                {
                    _Name: 'ProfileReset',
                    Title: '$(L,reset)',
                    Style: 'ResetRed',
                    OnPress:
                        '/SAPAssetManager/Rules/Common/ResetAlertAction.js',
                    TextAlignment: 'center',
                },
            ],
            _Type: 'Section.Type.ButtonTable',
        },
    );
}
