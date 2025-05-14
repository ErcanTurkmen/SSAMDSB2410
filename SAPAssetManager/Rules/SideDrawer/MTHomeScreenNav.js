import { appendWCMBusinessObjects } from './MTHomeScreenClassicNav';

export default function MTHomeScreenClassicNav(context) {
    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/Overview.page');

    appendWCMBusinessObjects(context, page);

    return context.executeAction({
        Name: '/SAPAssetManager/Actions/Common/GenericNav.action',
        Properties: {
            PageMetadata: page,
            ClearHistory: true,
            ModalPage: false,
        },
        Type: 'Action.Type.Navigation',
    });
}
