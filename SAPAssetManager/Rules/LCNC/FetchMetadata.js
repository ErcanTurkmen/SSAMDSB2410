import Logger from '../Log/Logger';
import ApplicationSettings from '../Common/Library/ApplicationSettings';

/**
 * Returns the metadata from the destination as a json string
 * @param {ClientAPI} context
 * @returns {string}
 */
export default function FetchMetadata(context) {
    // Read from app settings first
    const cachedValue = ApplicationSettings.getString(context, '$metadata');
    if (cachedValue) {
        return cachedValue;
    }

    const result = ReadMetadataFromOfflineProvider(context) ;

    if (result) {
        SaveMetadata(context, result);
    }

    return result;
}

export function ReadMetadataFromOfflineProvider(context) {
    try {
        let xmlJSModule = require('xml-js');
        let provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
        let result = '';
        let xmlString;

        xmlString = provider?.getMetadata?.()?.getOriginalText();
        if (xmlString) {
            result = xmlJSModule.xml2json(xmlString, { compact: true, spaces: 4 });
        }

        return result;

    } catch (error) {
        Logger.error('Error during metadata fetch: ' + error.toString());
        return '';
    }
}

export function SaveMetadata(context, jsonString) {
    const result = jsonString || ReadMetadataFromOfflineProvider(context);
    if (result) {
        ApplicationSettings.setString(context, '$metadata', result);
        Logger.info('Metadata saved to app settings');
    }
}
