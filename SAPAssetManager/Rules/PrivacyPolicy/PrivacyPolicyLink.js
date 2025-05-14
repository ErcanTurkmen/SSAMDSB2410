import URLModuleLibrary from '../../Extensions/URLModule/URLModuleLibrary';

/**
* Open the privacy policy
* @param {IClientAPI} context
*/
export default function PrivacyPolicyLink(context) {
    if (context.getLanguage() === 'zh-CN') {
        return URLModuleLibrary.openUrl('https://help.sap.com/doc/93bf1365610b44c79462fe788fa7971a/Latest/en-US/PrivacyPolicy.htm');
    }

    return URLModuleLibrary.openUrl('https://help.sap.com/doc/1654f0eb2ced4c8b88079df8c6580601/Latest/en-US/PrivacyPolicy.htm');
}
