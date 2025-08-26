{
    "MainPage": "/SAPAssetManager/Pages/SideMenuDrawer.page",
    "_Name": "SAPAssetManager",
    "OnUserSwitch": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnUserSwitch.js",
    "OnWillUpdate": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnWillUpdate.js",
    "OnDidUpdate": "/SAPAssetManager/Rules/ApplicationEvents/ApplicationOnDidUpdate.js",
    "Version": "1",
    "OnLaunch": [  
        "/SAPAssetManager/Rules/Common/SetAppLaunchStarted.js",
	    "/SAPAssetManager/Rules/Log/InitializeLoggerAndNativeScriptObject.js",
        "/SAPAssetManager/Rules/Common/PerformAppUpdateCheck.js",
        "/SAPAssetManager/Rules/Sync/InitializeSyncState.js",
        "/SAPAssetManager/Rules/Common/MonitorNetworkState.js"
    ],
    "Styles": "/SAPAssetManager/Styles/Styles.less",
    "Localization": "/SAPAssetManager/i18n/i18n.properties",
    "OnResume": "/SAPAssetManager/Rules/ApplicationEvents/ResumeEventHandler.js",
    "OnReceiveForegroundNotification" : "/SAPAssetManager/Rules/PushNotifications/PushNotificationsForegroundNotificationEventHandler.js",
    "OnReceiveFetchCompletion" : "/SAPAssetManager/Rules/PushNotifications/PushNotificationsContentAvailableEventHandler.js",
    "OnReceiveNotificationResponse" : "/SAPAssetManager/Rules/PushNotifications/PushNotificationsReceiveNotificationResponseEventHandler.js",
    "OnSuspend": "/SAPAssetManager/Rules/ApplicationEvents/SuspendEventHandler.js",
    "OnExit": "/SAPAssetManager/Rules/ApplicationEvents/ExitEventHandler.js",
    "OnLinkDataReceived": "/SAPAssetManager/Rules/DeepLinks/LinkDataReceived.js",
    "_SchemaVersion": "24.11"
}
