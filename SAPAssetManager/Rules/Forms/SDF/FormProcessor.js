import XMLJS from 'xml-js';
import libBase64 from '../../Common/Library/Base64Library';
import isAndroid from '../../Common/IsAndroid';
import Logger from '../../Log/Logger';

export const PROCESS_STATUS = Object.freeze({
    OK: Symbol('Ok'),
    STOP: Symbol('Stop'),
    REPLACE_DATA: Symbol('Replace Data'),
});

/**
 * Processing status and optional data for replacement
 * @typedef {Object} ProcessResult
 * @property {symbol} status 
 *  OK continues with normal save process
 *  STOP interrupts saving and executes the closePage action instead
 *  REPLACE_DATA uses the optional data property of this object as the data to save.
 *               be sure the data format is valid else forms may break as a result
 * @property {string=} data base64 encoded xml replacement for existing data
 */

/**
 * This is a place to do any specific processing of form data before it is saved to the offline database.
 * 
 * @param {IContext} context 
 * @param {Object} formData 
 * @returns {Promise<ProcessResult>} 
 */
export async function FormProcessor(context, formData) {
    if (formData.AppName === 'SDFExample' 
        && formData.FormName === 'SDFExample' 
        && Number(formData.FormVersion) === 1) {
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Processing form ${formData.AppName} ${formData.FormName} ${formData.FormVersion}`);
        try {
            const xmlString = await libBase64.transformBase64ToString(isAndroid(context), formData.Data);
            const jsonData = XMLJS.xml2js(xmlString, {compact: true});
            const reading = jsonData.form['section-1']['control-1']._attributes.reading;
            const point = jsonData.form['section-1']['control-1']._attributes['measurement-point'];
            const message = `${context.localizeText('measuring_points_x', [point])} - ${context.localizeText('reading_uom', [reading])}`;
            await context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/NoDataChanged.action',
                'Properties': {
                    'Message': message,
                },
            });
            return Promise.resolve({status: PROCESS_STATUS.STOP});
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error running custom whatnot ${error}`);
            return Promise.resolve({status: PROCESS_STATUS.STOP});
        }
    } else if (formData.AppName === 'SDFReplaceExample'
        && formData.FormName === 'SDFReplaceExample'
        && Number(formData.FormVersion) === 1) {
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Processing replacement form ${formData.AppName} ${formData.FormName} ${formData.FormVersion}`);
        try {
            const xmlString = await libBase64.transformBase64ToString(isAndroid(context), formData.Data);
            const jsonData = XMLJS.xml2js(xmlString, {compact: true});
            jsonData.form['section-1']['control-1']._attributes.reading = Number(jsonData.form['section-1']['control-1']._attributes.reading) * 5;
            jsonData.form['section-1']['control-1']._attributes['modified-by'] = 'mobile device';

            const modifiedXML = XMLJS.js2xml(jsonData, {compact: true});
            const modifiedData = libBase64.transformStringToBase64(isAndroid(context), modifiedXML);
            return Promise.resolve({status: PROCESS_STATUS.REPLACE_DATA, data: modifiedData});
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error running custom whatnot ${error}`);
            return Promise.resolve({status: PROCESS_STATUS.STOP});
        }
    }

    return Promise.resolve({status: PROCESS_STATUS.OK});
}
