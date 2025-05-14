import libCom from '../../Common/Library/CommonLibrary';

export default function IsQuantityEditable(context) {
    const type = context.binding?.['@odata.type']?.substring('#sap_mobile.'.length);
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    return objectType !== 'REV' && !(context.binding && ['InboundDeliveryItem', 'OutboundDeliveryItem'].includes(type));
}

