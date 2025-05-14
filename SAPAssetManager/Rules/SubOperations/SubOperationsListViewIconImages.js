import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libMobile from '../MobileStatus/MobileStatusLibrary';

export default function SubOperationsListViewIconImages(pageProxy) {
    let iconImage = [];
    if (libCommon.getTargetPathValue(pageProxy, '#Property:@sap.isLocal')) {
        iconImage.push(libCommon.GetSyncIcon(pageProxy));
    }

    const binding = pageProxy.binding;

    if (binding && binding.SubOperationNo && libMobile.isSubOperationStatusChangeable(pageProxy)) { //check mobile status only if suboperation level assignment
        return Promise.resolve().then(() => libMobile.getMobileStatus(pageProxy.binding, pageProxy)).then(function(result) {
            if (result === 'COMPLETED') {
                iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
            }
            return iconImage;
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), 'SUBJOBSTEPS', err);
        });
    } else { //check system status
        return libMobile.isMobileStatusConfirmed(pageProxy, undefined, binding.SubOperationNo).then(function(result) {
            if (result) {
                iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
            }
            return iconImage;
        }).catch(err => {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySubOperations.global').getValue(), 'SUBJOBSTEPS', err);
        });
    }

}
