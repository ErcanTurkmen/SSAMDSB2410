import IsMetadataParsingFeatureEnabled from './IsMetadataParsingFeatureEnabled';
import { SaveMetadata } from './FetchMetadata';

/**
 * Refresh Metadata from the Odata Provider
 * @param {ClientAPI} context
 * @returns {Promise}
 */
export default async function RefreshMetadata(context) {

    try {
        if (IsMetadataParsingFeatureEnabled(context)) {
            let provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
            await provider?.refreshMetadata?.();
            SaveMetadata(context);
            return Promise.resolve();
        }
    } catch (error) {
        console.error('Failed to refresh metadata:', error);
        return Promise.resolve();
    }

}
