import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SubItemDiscardButton(context) {
    return {
        'Type': 'Button',
        'IsMandatory': false,
        'IsReadOnly': !CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']),
        'Property': '',
        'Parameters': {
            'Value': '$(L,discard)',
            'Action': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/SubItem/SubItemDiscardAction.js',
            'Style': 'Secondary',
        },
    };
}
