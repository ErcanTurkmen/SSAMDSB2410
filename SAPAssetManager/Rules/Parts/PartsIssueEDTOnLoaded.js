
import libCom from '../Common/Library/CommonLibrary';

export default function PartIssueEDTOnLoaded(context) {
    const outPartsList = libCom.getStateVariable(context, 'OutPartsList');
    if (outPartsList.length > 0) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('ignored_parts'),
            },
        });
    }
    return Promise.resolve();
}
