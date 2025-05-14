import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function ConfirmationsDetailsNav(context) {
    return generateToolbarItems(context.getPageProxy()).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/Details/ConfirmationsDetailsNav.action');
    });
}

function generateToolbarItems(pageProxy) {
    if (MobileStatusLibrary.isServiceOrderStatusChangeable(pageProxy)) {
        const binding = pageProxy.getActionBinding() || {};
        const objectType = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ConfirmationMobileStatusObjectType.global').getValue();
        const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(pageProxy, binding, objectType);

        return StatusGeneratorWrapper._getStatusSequencesFromStateMachine().then(statusSequences => {
            const resultItems = [];

            if (statusSequences.length > 0) {
                resultItems.push(StatusGeneratorWrapper._getStatusUIItem(statusSequences[0], {
                    TransitionText: pageProxy.localizeText('complete_confirmation'),
                }));
            }

            return DetailsPageToolbarClass.getInstance().saveToolbarItems(pageProxy, resultItems, 'ConfirmationsDetailsScreenPage').then(() => {
                return Promise.resolve();
            });
        });
    } else {
        return Promise.resolve();
    }
}
