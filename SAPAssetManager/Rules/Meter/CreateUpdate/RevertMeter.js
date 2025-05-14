import DiscardReadings from './DiscardReadings';
import DiscardGoodsMovement from './DiscardGoodsMovement';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function RevertMeter(context) {
    return DiscardReadings(context).then(() => {
        return DiscardGoodsMovement(context).then(() => {
            let removalAction;

            if (CommonLibrary.getPageName(context.evaluateTargetPathForAPI('#Page:-Previous')) !== 'MeterDetailsPage') {
                context.getPageProxy().getClientData().NoNeedsNavBackAction = true;
            }

            if (context.binding.Device_Nav['@sap.inErrorState']) {
                removalAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardStatusInstallFromErrorArchive.action';
            } else {
                removalAction = '/SAPAssetManager/Actions/Meters/Discard/DiscardRemove.action';
            }

            return context.getPageProxy().executeAction(removalAction).then(() => {
                return context.getPageProxy().executeAction({
                    'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action',
                    'Properties': {
                        'Message': context.localizeText('meter_reverted_successfully'),
                    },
                });
            });
        });
    });
}
