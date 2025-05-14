import localMediaSave from './Save/DocumentFileSaveLocal';

export default function DownloadAndSaveMedia(pageProxy) {
    return Promise.all(pageProxy.getClientData().mediaReadLinks
        .map(readLink => pageProxy.executeAction({
            Name: '/SAPAssetManager/Actions/Documents/DownloadAndSaveMedia.action',
            Properties: {
                Target: {
                    ReadLink: readLink,
                },
            },
        })),
    )
        .then(() => localMediaSave(pageProxy))
        .then(() => true);
}
