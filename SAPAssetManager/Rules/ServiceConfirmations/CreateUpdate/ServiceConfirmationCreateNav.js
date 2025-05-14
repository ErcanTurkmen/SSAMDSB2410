import S4ErrorsLibrary from '../../S4Errors/S4ErrorsLibrary';
import IsServiceOrderReleased from '../../ServiceOrders/Status/IsServiceOrderReleased';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default async function ServiceConfirmationCreateNav(context) {
    ServiceConfirmationLibrary.getInstance().resetAllFlags();

    const binding = context.binding || {};
    const isOrderContainsErrors = await S4ErrorsLibrary.isServiceOrderContainsErrors(context, binding);
    if (isOrderContainsErrors) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
            'Properties': {
                'Title': context.localizeText('error'),
                'Message': context.localizeText('order_contains_errors_error_message'),
                'OKCaption': context.localizeText('ok'),
            },
        });
    }

    const isServiceOrderNotReleased = await IsServiceOrderReleased(context, undefined, binding).then(released => !released);
    if (isServiceOrderNotReleased) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
            'Properties': {
                'Title': context.localizeText('error'),
                'Message': context.localizeText('not_released_order_error_message'),
                'OKCaption': context.localizeText('ok'),
            },
        });
    }

    return ServiceConfirmationLibrary.getInstance().openStartPage(context);
}
