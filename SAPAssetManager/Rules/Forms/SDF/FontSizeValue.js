/**
 * 
 * @param {IClientAPI} context 
 * @returns {string}
 */
export default function FontSizeValue(context) {
    return context.nativescript.appSettingsModule.getString('Fontsize') || 'S';
}
