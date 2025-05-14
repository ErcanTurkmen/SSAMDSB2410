import MobileStatusLibrary from '../../../MobileStatus/MobileStatusLibrary';

export default function ServiceItemMobileStatusSuccessMessage(context) {
    let messageString = 'status_updated';
    let clientData = context.getClientData();

    if (clientData && clientData.ChangeStatus) {
        let status = clientData.ChangeStatus;
        const { STARTED, HOLD, TRANSFER, COMPLETED, REJECTED } = MobileStatusLibrary.getMobileStatusValueConstants(context);
		
        switch (status) {
            case STARTED:
                messageString = 'service_item_started';
                break;
            case HOLD:
                messageString = 'service_item_on_hold';
                break;
            case TRANSFER:
                messageString = 'service_item_transferred';
                break;
            case COMPLETED:
                messageString = 'service_item_completed';
                break;
            case REJECTED:
                messageString = 'service_item_rejected';
                break;
            default:
                break;
        }
    }

    return context.localizeText(messageString);
}
