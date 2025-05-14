import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function PackageDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/Packages/PackageDetailsPageNav.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsContainerStatus_Nav, FldLogsPackageItem_Nav');
}
