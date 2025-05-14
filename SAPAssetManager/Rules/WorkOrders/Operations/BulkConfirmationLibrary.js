import CommonLibrary from '../../Common/Library/CommonLibrary';
import { CreateBDSLinks } from '../../Documents/Create/DocumentCreateBDSLinkNoClose';
import DocumentLibrary from '../../Documents/DocumentLibrary';
import Logger from '../../Log/Logger';
import SignatreOnCreateMimeType from '../../SignatureControl/Create/SignatreOnCreateMimeType';
import SignatureOnCreateFileDescription from '../../SignatureControl/Create/SignatureOnCreateFileDescription';
import SignatureOnCreateMedia from '../../SignatureControl/Create/SignatureOnCreateMedia';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';

const BULK_CONFIRMATION_SIGNATURE_FLAG = 'BulkConfirmationSignatureActiveFlag';
const BULK_CONFIRMATION_SIGNATURE = 'BulkConfirmationSignature';

export function IsBulkConfirmationSignatureFlowActive(context) {
    return CommonLibrary.getStateVariable(context, BULK_CONFIRMATION_SIGNATURE_FLAG);
}

export function IsBulkConfirmationSignatureRequired(context) {
    return CommonLibrary.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') === 'Y';
}

export function RunBulkConfirmationSignatureFlow(context) {
    CommonLibrary.setStateVariable(context, BULK_CONFIRMATION_SIGNATURE_FLAG, true);
    return context.executeAction('/SAPAssetManager/Actions/SignatureControl/View/SignatureControlView.action');
}

export function ResetBulkConfirmationSignatureFlow(context) {
    CommonLibrary.removeStateVariable(context, BULK_CONFIRMATION_SIGNATURE_FLAG);
    CommonLibrary.removeStateVariable(context, BULK_CONFIRMATION_SIGNATURE);
}

export async function StoreBulkConfirmationSignature(context) {
    let signature = {};

    signature.ObjectLink = CommonLibrary.getAppParam(context, 'DOCUMENT', DocumentLibrary.lookupParentObjectType(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentParentODataTypeOperation.global').getValue()));
    
    let isUserSupervisor = await SupervisorLibrary.isUserSupervisor(context);
    signature.FileName = isUserSupervisor ?  context.getGlobalDefinition('/SAPAssetManager/Globals/Signature/SignatureSupervisorPrefix.global').getValue() : 
        context.getGlobalDefinition('/SAPAssetManager/Globals/Signature/SignatureTechnicianPrefix.global').getValue();

    signature.Description = await SignatureOnCreateFileDescription(context);
    signature.MimeType = SignatreOnCreateMimeType(context);
    signature.Media = SignatureOnCreateMedia(context);

    CommonLibrary.setStateVariable(context, BULK_CONFIRMATION_SIGNATURE, signature);
}

export function CreateBulkConfirmationSignature(context, operationBinding) {
    if (!IsBulkConfirmationSignatureFlowActive(context)) return Promise.resolve();

    let signature = CommonLibrary.getStateVariable(context, BULK_CONFIRMATION_SIGNATURE);

    if (signature) {
        let fileType = signature.MimeType.split('/')[1];
        let fileName = `${signature.FileName}_ID-${operationBinding.OrderId}-${operationBinding.OperationNo}.${fileType}`;

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/SignatureControl/Create/SignatureControlCreateSignature.action',
            'Properties': {
                'Properties': {
                    'ObjectLink': signature.ObjectLink,
                    'FileName': fileName,
                    'Description': signature.Description,
                    'MimeType': signature.MimeType,
                },
                'Media': signature.Media,
                'Headers': {
                    'slug': {
                        'ObjectLink': signature.ObjectLink,
                        'ObjectKey': operationBinding.ObjectKey,
                        'FileName': fileName,
                        'Description': signature.Description,
                        'OrderID': operationBinding.OrderId,
                        'OperationNo': operationBinding.OperationNo,
                    },
                },
                'OnSuccess': '',
            },
        }).then((result) => {
            const binding = operationBinding;
            const parentReadLink = binding['@odata.readLink'];
            const readLinks = result.data;

            return CreateBDSLinks(context, readLinks, parentReadLink, 'WOOperation_Nav', 'MyWorkOrderOperations', 'MyWorkOrderDocuments', { ObjectKey: binding.OperationNo[0] === 'L' ? binding.OperationNo : binding.ObjectKey });
        }).catch((error) => {
            Logger.error('CreateBulkConfirmationSignature', error);
            return Promise.reject(error);
        });
    }

    return Promise.resolve();
}
