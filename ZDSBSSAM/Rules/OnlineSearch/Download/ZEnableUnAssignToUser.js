import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import DownloadFailed from '../../../../SAPAssetManager/Rules/OnlineSearch/Download/DownloadFailed';
import libOpMobile from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';

export default function ZEnableUnAssignToUser(context) {
    const pageProxy = context.getPageProxy();
    //const binding = pageProxy.getActionBinding();
    const binding = context.binding;
    return libOpMobile.isAnyOperationStarted(context).then((isAnyOperationStarted) => {
        return !isAnyOperationStarted;
    });
}
