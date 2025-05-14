import Logger from '../Log/Logger';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OpenOnlineDocument(context) {
    const binding = context.getPageProxy().getActionBinding();
    const path = `/SAPAssetManager/Services/OnlineAssetManager.service/Documents('${binding.DocumentID}')/$value`;
    context.showActivityIndicator();
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Documents/DocumentOpen.action',
        'Properties': {
            'Path': path,
            'MimeType': binding.MimeType || binding.Mimetype,
        },
    }).catch(err => {
        Logger.error('OpenOnlineDocument', err);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('document_download_fail_server'),
            },
        });
    }).finally(() => context.dismissActivityIndicator());
}
