import ODataDate from '../../Common/Date/ODataDate';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import IsApprovalSignatureEnabled from './IsApprovalSignatureEnabled';
import libDoc from '../../Documents/DocumentLibrary';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';

/** @param {IClientAPI} context  */
export default function IssueApproval(context) {
    /** @type {WCMApprovalProcess & { canBeIssued: boolean, issueCreateProperties: { WCMDocument: string, ObjectNumber:string, Permit: string }}} */
    const binding = context.binding;
    const isApprovalSignatureEnabled = IsApprovalSignatureEnabled(context);

    if (isApprovalSignatureEnabled) {
        context.getClientData().signatureMedia = context.evaluateTargetPath('#Control:SignatureCaptureFormCell/#Value');
    }

    return context.executeAction('/SAPAssetManager/Actions/WCM/Approvals/ConfirmIssue.action')
        .then((/** @type {{data: boolean, enabled: boolean, error: any, status: number}} */ result) => result.data)
        .then(isOk => {
            if (!isOk) {
                throw new Error('IssueApproval confirm page cancelled');
            }
            context.showActivityIndicator();
        })
        .then(() => issueWCMApproval(context, binding))
        .then(() => isApprovalSignatureEnabled ? createIssueApprovalSignature(context, binding) : Promise.resolve())
        .then(() => createApprovalProcessSegment(context, binding))
        .then(() => UpdateTrafficLightStatus(context, binding))
        .then(() => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', getHeaderDetails(binding)['@odata.readLink'], [], '')
                .then(result => {
                    context.getPageProxy().setActionBinding(result.getItem(0));
                    return context.executeAction({
                        'Name': '/SAPAssetManager/Actions/WCM/Approvals/ApprovalsListViewNav.action',
                        'Properties': {
                            'ClearHistory': true,
                        },
                    });
                });
        })
        .then(() => context.executeAction({
            'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/ItemsSubmittedToast.action',
            'Properties': {
                'Message': context.localizeText('item_issued_success_message'),
            },
        }))
        .catch((error) => {
            Logger.error('IssueApproval', error);
        })
        .then(() => {
            context.dismissActivityIndicator();
            //Add AnalyticsManager Check
            AnalyticsManager.permitApprovalSuccess();
        });
}

/** @param {WCMApprovalProcess} wcmApprovalProcess  */
function issueWCMApproval(context, wcmApprovalProcess) { // backend needs this PUT request to issue the approval, then regen the corresponding ProcessSegment
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
        'Properties': {
            'Target':
            {
                'EntitySet': 'WCMApprovalProcesses',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': wcmApprovalProcess['@odata.readLink'],
            },
            'Properties': {
                'ChangedOn': new ODataDate().toDBDateTimeString(context),
            },
            'RequestOptions': {
                'UpdateMode': 'Replace',
            },
        },
    });
}

/** @param {WCMApprovalProcess} wcmApprovalProcess  */
function createApprovalProcessSegment(context, wcmApprovalProcess) {  // need to create something tangible locally to be able to determine if the process is approved or not (after sync the backend generated segment will replace this)
    const now = new ODataDate();
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action',
        'Properties': {
            'Target':
            {
                'EntitySet': 'WCMApprovalProcessSegments',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Properties': {
                'ObjectNumber': wcmApprovalProcess.ObjectNumber,
                'Counter': wcmApprovalProcess.Counter,
                'SegmentCounter': '999999',
                'SegmentInactive': '',
                'CreatedOn': now.toLocalDateString(),
                'EnteredAt': now.toLocalTimeString(),
                'EnteredBy': CommonLibrary.getSapUserName(context),
            },
            'RequestOptions': {
                'RemoveCreatedEntityAfterUpload': true,
            },
            'CreateLinks': [
                {
                    'Property': 'WCMApprovalProceses',
                    'Target': {
                        'EntitySet': 'WCMApprovalProcesses',
                        'ReadLink': wcmApprovalProcess['@odata.readLink'],
                    },
                },
            ],
        },
    });
}

/** @param {WCMApprovalProcess} wcmApprovalProcess  */
function UpdateTrafficLightStatus(context, wcmApprovalProcess) {  // after sync, banckend will ignore this and re-set the trafficLight value (which should be equivalent with the updated/ignored one)
    const headerNavProperty = (wcmApprovalProcess.WCMApplication && 'WCMApplications') || (wcmApprovalProcess.WCMDocument && 'WCMDocumentHeaders') || undefined;
    if (!headerNavProperty) {
        return undefined;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', getHeaderDetails(wcmApprovalProcess)['@odata.readLink'], [], '$expand=WCMApprovalProcesses/WCMApprovalProcessSegments')
        .then((/** @type {ObservableArray<WCMApplication | WCMDocumentHeader>} */ result) => {
            if (ValidationLibrary.evalIsEmpty(result)) {
                return undefined;
            }
            const headerObject = result.getItem(0);
            const newTrafficLightStatus = GetTrafficLightStatus(headerObject.WCMApprovalProcesses, context);
            if (newTrafficLightStatus === headerObject.TrafficLight) {  // no update necessary
                return undefined;
            }
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
                'Properties': {
                    'Target': {
                        'EntitySet': headerNavProperty,  // WCMApplications or WCMDocumentHeaders
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': headerObject['@odata.readLink'],
                    },
                    'Properties': {
                        'TrafficLight': newTrafficLightStatus,
                    },
                    'RequestOptions': {
                        'UpdateMode': 'Merge',
                    },
                },
            });
        });
}

/** @param {WCMApprovalProcess[]} wcmApprovalProcess  */
function GetTrafficLightStatus(wcmApprovalProcesses, context) {
    const notApprovedProcesses = wcmApprovalProcesses.filter(p => (p.WCMApprovalProcessSegments || []).every(s => s.SegmentInactive !== ''));  // if there is any, all segments are inactive -- revoked approval
    if (wcmApprovalProcesses.length === notApprovedProcesses.length) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/WaitForApproval.global').getValue();
    } else if (notApprovedProcesses.length === 0) {
        return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/Approved.global').getValue();
    }
    return context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/PartiallyApproved.global').getValue();
}

function createIssueApprovalSignature(context, binding) {
    const signatureMedia = context.getClientData().signatureMedia;

    const fileType = signatureMedia.contentType.split('/')[1];
    const header = getHeaderDetails(binding);
    const headerDataType = header['@odata.type'];
    const isHeaderWorkPermit = headerDataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue();
    const objectLink = libDoc.getObjectLink(context, headerDataType);
    const signaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Signature/SignatureIssueApprovalPrefix.global').getValue();
    const fileName = `${signaturePrefix}_${isHeaderWorkPermit ? binding.WCMApplication : binding.WCMDocument}_${binding.Permit}_${CommonLibrary.getSapUserName(context)}.${fileType}`;
    const fileDescription = isHeaderWorkPermit ? context.localizeText('work_permit_approval_signature') : '';
    const objectKey = getObjectKeyByHeader(context, header);

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/Approvals/IssueApprovalSignatureCreate.action',
        'Properties': {
            'Headers': {
                'slug': {
                    'ObjectLink': objectLink,
                    'ObjectKey': objectKey,
                    'FileName': encodeURIComponent(fileName),
                    'Description': encodeURIComponent(fileDescription),
                },
            },
            'Properties': {
                'ObjectLink': objectLink,
                'FileName': fileName,
                'Description': fileDescription,
            },
        },
    });
}

export function getHeaderDetails(binding) {
    return binding.WCMApplications ? binding.WCMApplications : binding.WCMDocumentHeaders;
}

export function getObjectKeyByHeader(context, header) {
    const maskLength = 12;
    const objectKeyMask = (new Array(maskLength).fill('0')).join('');
    const headerNumber = header['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue() ? header.WCMApplication : header.WCMDocument;
    return objectKeyMask.slice(0, maskLength - headerNumber.length) + headerNumber;
}
