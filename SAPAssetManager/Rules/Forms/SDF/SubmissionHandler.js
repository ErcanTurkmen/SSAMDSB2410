import Logger from '../../Log/Logger';
import MeasuringPointTrendLineNav from '../../Measurements/Points/MeasuringPointTrendLineNav';
import { PROCESS_STATUS, FormProcessor }  from './FormProcessor';

const REQUEST_TYPE = {
    ATTACHMENT: 'attachment',
    ODATA: 'odata',
    SAVE: 'save',
    ACTION: 'action',
};

const ACTION_MAP = {
    MeasurementPointTrendLine: MeasuringPointTrendLineNav,
};

export default async function SubmissionHandler(context) {
    Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), 'SubmissionHandler started');
    const clientData = context.evaluateTargetPath('#Page:FormRunner/#ClientData');

    const communicationType = context.binding['communication-type'];
    const load = context.binding.load;
    const data = context.binding.data;
    const status = context.binding.status;
    const type = context.binding.type;
    const initialStatus = (clientData && clientData.FormData && clientData.FormData.PreviousStatus) ? clientData.FormData.PreviousStatus : context.binding.initialStatus;
    const source = context.binding.source;
    const isNew = context.binding.new;
    const appName = context.binding.applicationName;
    const formName = context.binding.formName;
    const formVersion = context.binding.formVersion;

    Logger.debug(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `SubmissionHandler found ${communicationType} ${load} ${data.length} bytes, ${status}, ${initialStatus}, ${source}, ${isNew}, ${appName}, ${formName}, ${formVersion}`);

    if ((communicationType === 'post') && (type === REQUEST_TYPE.SAVE)) {
        const formData = {
            Data: data,
            Status: status || 'New',
            NonMergable: status === initialStatus,
            PreviousStatus: initialStatus,
            AppName: appName,
            FormName: formName,
            FormVersion: formVersion,
            IsNew: isNew,
        };

        const processingResult = await FormProcessor(context, formData);
        const closePageAction = '/SAPAssetManager/Actions/Page/ClosePage.action';

        switch (processingResult.status) {
            case PROCESS_STATUS.OK:
                // ok to do nothing
                break;
            case PROCESS_STATUS.STOP:
                setTimeout(() => context.getPageProxy().executeAction(closePageAction), 0); // put this close action at the end of the queue
                return '';
            case PROCESS_STATUS.REPLACE_DATA:
                formData.Data = processingResult.data;
                break;
            default:
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error processing form unknown result: ${processingResult}`);
                break;
        }

        clientData.FormData = formData;
        const pageProxy = context.getPageProxy();
        let action = '/SAPAssetManager/Actions/Forms/SDF/FormInstanceCreate.action';
        if (pageProxy.binding.FormInstanceID) {
            formData.readLink = pageProxy.binding.DynamicFormInstance_Nav['@odata.readLink'];
            action = '/SAPAssetManager/Actions/Forms/SDF/FormInstanceUpdate.action';
        }
        return pageProxy.executeAction(action);
    } else if (communicationType === 'post' && type === REQUEST_TYPE.ATTACHMENT) {
        const urlobj = context.binding.url;
        const {instanceID, attachmentID} = parseRequestIDs(urlobj.pathname);
        const mimeType = 'application/octet-stream';
        const pageProxy = context.getPageProxy();

        const parsedFormVersion = parseInt(formVersion);
        if (isNaN(parsedFormVersion)) {
            throw new Error(`Could not parse form version number: ${formVersion}`);
        }

        if (instanceID === '') {
            throw new Error('Could not find form InstanceID');
        }
        if (attachmentID === '') {
            throw new Error('Could not find form AttachmentID');
        }

        return context.base64StringToBinary(context.binding.data).then((binaryData) => {
            const attachmentData = {
                Media: {
                    content: binaryData,
                    contentType: mimeType,
                },
                AppName: appName,
                FormName: formName,
                FormVersion: parsedFormVersion,
                FormInstanceID: instanceID,
                AttachmentID: attachmentID,
                MimeType: mimeType,
                ObjectType: pageProxy.binding.ObjectType,
                ObjectKey: pageProxy.binding.ObjectKey,
                TechnicalEntityType: pageProxy.binding.TechnicalEntityType,
                TechnicalEntityKey: pageProxy.binding.TechnicalEntityKey,
            };
    
            clientData.AttachmentData = attachmentData;
            let action = '/SAPAssetManager/Actions/Forms/SDF/FormAttachmentCreate.action';

            return pageProxy.executeAction(action);
        });
    } else if (communicationType === 'get' && type === REQUEST_TYPE.ODATA) {
        const entitysetPrefix = '/fr/service/custom/entityset/'; // not final
        const readurl = context.binding.url;
        const entityset = readurl.pathname.slice(entitysetPrefix.length);
        let params = readurl.search;
        if (params.startsWith('?')) {
            params = params.slice(1);
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], params).then(function(results) {
            const resultData = [];
            for (let x = 0; x < results.length; x++) {
                const item = results.getItem(x);
                resultData.push(item);
            }
            const returnData = {EntitySet: resultData};
            return JSON.stringify(returnData);
        })
        .catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error reading form data from service: ${readurl} - ${error}`);
            // return empty set to avoid spurious errors
            const returnData = {EntitySet: []};
            return JSON.stringify(returnData);
        });
    } else if (communicationType === 'get' && type === REQUEST_TYPE.ACTION) {
        const actionPrefix = '/fr/service/custom/action/'; // not final
        const readurl = context.binding.url;
        const actionKey = readurl.pathname.slice(actionPrefix.length);
        const action = ACTION_MAP[actionKey] || '/' + actionKey;

        context.getPageProxy().setActionBinding(readurl.searchParams);

        if (typeof action === 'function') {
            return action(context)
            .catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error executing form rule: ${readurl} - ${error}`);
                throw error;
            });
        }

        // default action functionality
        return context.getPageProxy().executeAction(action).then(function(results) {
            if (results && results.error) {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(),`Error executing form action ${readurl} - ${results.error.message}`);
            }
            return results;
        })
        .catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error executing form action: ${readurl} - ${error}`);
            throw error;
        });
    }
    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Unknown call to submission handler: ${communicationType} ${type} ${load} ${data.length} bytes, ${status}, ${initialStatus}, ${source}, ${isNew}, ${appName}, ${formName}, ${formVersion}`);
    throw new Error(`Unknown call to submission handler: ${communicationType} ${type}`);
}

/**
 * Attempts to parse the instance and attachment IDs given a pathname.
 * If they do not look like 40 character hex strings, they will be returned as empty strings.
 * @param {string} pathname pathname part of the parsed URL
 * @returns {{instanceID: string, attachmentID: string}} The parsed IDs, else empty string
 * @throws {Error}
 */
function parseRequestIDs(pathname) {
    try {
        const spliturl = pathname.split('/');
        let instanceid = spliturl[spliturl.length - 2];
        let dataid = spliturl[spliturl.length -1].split('.')[0];
        const regex = /^[a-f0-9]{40}$/;
        if (!instanceid.match(regex)) {
            instanceid = '';
        }
        if (!dataid.match(regex)) {
            dataid = '';
        }
        return {instanceID: instanceid, attachmentID: dataid};
    } catch (e) {
        const errormsg = `Error parsing the request ID: ${e}`;
        throw new Error(errormsg);
    }
}

export { REQUEST_TYPE, parseRequestIDs };
