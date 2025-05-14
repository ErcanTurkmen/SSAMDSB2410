import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function createIssueorReceiptSignature(context) {

    let FieldSignature = '';
    let user = '';
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');

    if (formCellContainer?.getControl('SignatureCaptureFormCell')) {
        FieldSignature = formCellContainer.getControl('SignatureCaptureFormCell').getValue();
        user = formCellContainer.getControl('Signatory').getValue();
    } else {
        FieldSignature = CommonLibrary.getStateVariable(context, 'signature');
        user = CommonLibrary.getStateVariable(context, 'signatureUser');
    }
    if (FieldSignature) {
        let signature = {};
        let fileextension = '.jpg';
        signature.ObjectLink = CommonLibrary.getAppParam(context, 'DOCUMENT', 'MaterialDocument');
        let customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Signature/SignatureCustomerPrefix.global').getValue();
        signature.FileName = `${customerSignaturePrefix}_${user}${fileextension}`;
        signature.Description = context.localizeText('customer_signature');

        return getObjectKeyByHeader(context).then(objectKey=> {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptSignatureCreate.action',
                'Properties': {
                    'Headers': {
                        'slug': {
                            'ObjectLink': signature.ObjectLink,
                            'ObjectKey': objectKey,
                            'FileName': signature.FileName,
                            'Description': signature.Description,
                        },
                    },
                    'Properties': {
                        'ObjectLink': signature.ObjectLink,
                        'FileName': signature.FileName,
                        'Description': signature.Description,
                    },
                },
            }).then(result => {
                CommonLibrary.setStateVariable(context, 'SignatureValue', result);
            });
        });
    } else return Promise.resolve(true);
}

function getObjectKeyByHeader(context) {
    let header = '';
    if (context.binding?.AssociatedMaterialDoc) {
        header = context.binding.AssociatedMaterialDoc['@odata.readLink'];
        return Promise.resolve('<' + header + ':MaterialDocNumber' + '>');
    } else {
        let matdocNumber = '';
        let matdocYear = '';
        if (CommonLibrary.getStateVariable(context, 'lastLocalmaterialDocNumber')) {
            matdocNumber = CommonLibrary.getStateVariable(context, 'lastLocalmaterialDocNumber');
            matdocYear = CommonLibrary.getStateVariable(context, 'lastLocalmaterialDocYear'); 
        }

        if (CommonLibrary.getStateVariable(context, 'MaterialDocNumberBulkUpdate')) {
            matdocNumber = CommonLibrary.getStateVariable(context, 'MaterialDocNumberBulkUpdate');
            matdocYear = CommonLibrary.getStateVariable(context, 'MaterialDocYearBulkUpdate');
        }
        
        let filter = `$filter=MaterialDocYear eq '${matdocYear}' and MaterialDocNumber eq '${matdocNumber}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', [], filter).then(result => {
            if (result && result.length > 0) {
                let entity = result.getItem(0);
                header = entity['@odata.readLink'];
                return '<' + header + ':MaterialDocNumber' + '>';
            }
            return '0';
        });
    }
}
