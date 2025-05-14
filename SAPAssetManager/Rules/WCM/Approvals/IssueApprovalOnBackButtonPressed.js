import libCommon from '../../Common/Library/CommonLibrary';

export default function IssueApprovalOnBackButtonPressed(context) {
    const eventData = context.getAppEventData();
    const isActivityBackPressedEvent = eventData && eventData.eventName === 'activityBackPressed';

    if (libCommon.unsavedChangesPresent(context)) {
        if (isActivityBackPressedEvent) {
            eventData.cancel = true;
        }

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Page/ConfirmCancelPage.action',
            'Properties': {
                'OnOK': '',
            },
        }).then(result => {
            if (isActivityBackPressedEvent && result.data) {
                return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
            }

            return result.data;
        });
    }

    return Promise.resolve(true);
}
