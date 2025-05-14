import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';

export default function ConfirmationsItemDetailsNav(context) {
    return generateToolbarItems(context.getPageProxy()).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/Item/ConfirmationsItemDetailsNav.action');
    });
}

function generateToolbarItems(pageProxy) {
    const binding = pageProxy.getActionBinding() || {};
    const objectType = pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ConfirmationItemMobileStatusObjectType.global').getValue();
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(pageProxy, binding, objectType);

    return StatusGeneratorWrapper._getStatusSequencesFromStateMachine().then(statusSequences => {
        const resultItems = [];

        if (statusSequences.length > 0) {
            resultItems.push(StatusGeneratorWrapper._getStatusUIItem(statusSequences[0], {
                TransitionText: pageProxy.localizeText('complete_confirmation_item'),
            }));
        }

        return DetailsPageToolbarClass.getInstance().saveToolbarItems(pageProxy, resultItems, 'ConfirmationsItemDetailsPage').then(() => {
            return Promise.resolve();
        });
    });

}
