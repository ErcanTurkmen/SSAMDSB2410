import ApplicationSettings from '../../Common/Library/ApplicationSettings';

/**
 * 
 * @param {IClientAPI} context 
 * @returns {string}
 */
export default function getStoredToken(context) {
    return ApplicationSettings.getString(context, 'SDF_XSUAA_TOKEN', '');
}
