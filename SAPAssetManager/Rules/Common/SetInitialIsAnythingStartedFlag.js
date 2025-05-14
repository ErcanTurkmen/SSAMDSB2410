import Logger from '../Log/Logger';
import libOpMobile from '../Operations/MobileStatus/OperationMobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import libSubOpMobile from '../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import libWOMobile from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libCommon from './Library/CommonLibrary';

export default async function SetInitialIsAnythingStartedFlag(context) {
    const isAnythingStartedPromise = getIsAnythingStartedPromiseForAssnType(context);

    return isAnythingStartedPromise
        .catch(error => {
            Logger.error('SetInitialIsAnythingStartedFlag', error);
        });
}

function getIsAnythingStartedPromiseForAssnType(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (libCommon.getS4AssnTypeLevel(context) === 'Item') {
            libCommon.removeStateVariable(context, 'IsAnyOperationStarted');
            return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted');
        }

        libCommon.removeStateVariable(context, 'isAnyOrderStarted');
        return S4ServiceLibrary.isAnythingStarted(context);
    }

    switch (libCommon.getWorkOrderAssnTypeLevel(context)) {
        case 'Header':
            libCommon.removeStateVariable(context, 'isAnyWorkOrderStarted');
            return libWOMobile.isAnyWorkOrderStarted(context);
        case 'Operation':
            libCommon.removeStateVariable(context, 'isAnyOperationStarted');
            return libOpMobile.isAnyOperationStarted(context);
        case 'SubOperation':
            libCommon.removeStateVariable(context, 'isAnySubOperationStarted');
            return libSubOpMobile.isAnySubOperationStarted(context);
        default:
            return Promise.resolve();
    }
}
