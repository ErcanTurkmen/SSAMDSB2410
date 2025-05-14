import CommonLibrary from '../Common/Library/CommonLibrary';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import QABSettings from '../QAB/QABSettings';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import WorkOrderMobileStatusLibrary from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';

export default function SubOperationUpdateNav(context) {
    const qabSettings = new SubperationQABSettings(context.getPageProxy());

    return qabSettings.generateChips();
}

class SubperationQABSettings extends QABSettings {

    async generateChips() {
        const isLocal = CommonLibrary.isCurrentReadLinkLocal(CommonLibrary.getTargetPathValue(this._context, '#Property:@odata.readLink'));
        const isOrderComplete = await WorkOrderMobileStatusLibrary.isOrderComplete(this._context);

        const chips = [
            this._createAddNoteChip({
                IsButtonEnabled: await EnableWorkOrderEdit(this._context) && (isLocal || !isOrderComplete),
                IsButtonVisibleBySettings: false,
            }),
            this._createAddNotificationChip({
                Label: this._context.localizeText('add_notification'),
                IsButtonEnabled: isLocal || !isOrderComplete,
            }),
            this._createAddServiceConfirmationChip({
                Label: this._context.localizeText('add_service_confirmation'),
                IsEnabled: ConfirmationsIsEnabled(this._context),
                IsButtonEnabled: IsAddConfirmationButtonVisible(this._context),
                Action: '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateFromSuboperation.js',
            }),
            await this._createTakeReadingsChip(),
        ];

        return super.generateChips(chips);
    }
}
