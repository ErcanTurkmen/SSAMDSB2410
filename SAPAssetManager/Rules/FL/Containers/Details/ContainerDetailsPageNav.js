import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function ContainerDetailsPageNav(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/FL/Containers/ContainersDetailsPageNav.action', pageProxy.getActionBinding()['@odata.readLink'],'$expand=FldLogsContainerStatus_Nav, FldLogsContainerItem_Nav, FldLogsPackage_Nav');
}
