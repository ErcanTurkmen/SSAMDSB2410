
import documentEditorCreateInfo from './DocumentEditorCreateInfo';

export default function DocumentEditorCreateLink(context, mediaReadLink) {
    return documentEditorCreateInfo(context).then(info => {
        if (info) {
            const serviceName = '/SAPAssetManager/Services/AssetManager.service';
            const properties = {ObjectKey: info.objectKey};

            let promises = [];
            let links = [];
            let link = context.createLinkSpecifierProxy(info.parentProperty, info.parentEntitySet, '', info.parentReadLink);
            links.push(link);
            link = context.createLinkSpecifierProxy('Document', 'Documents', '', mediaReadLink);
            links.push(link);
            promises.push(context.create(serviceName, info.entitySet, properties, links, {'OfflineOData.RemoveAfterUpload':'true'}));

            return Promise.all(promises).then(() => {
                return true;
            }).catch(() => {
                return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action');
            });
        }
        return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action');
    });

}
