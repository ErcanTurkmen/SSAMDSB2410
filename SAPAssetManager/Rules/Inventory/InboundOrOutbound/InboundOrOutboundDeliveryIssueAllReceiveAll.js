import InboundOutboundDeliveryReceiveAllIssueAllIsAllowed from '../IssueOrReceipt/BulkUpdate/InboundOutboundDeliveryReceiveAllIssueAllIsAllowed';
import comLib from '../../Common/Library/CommonLibrary';

const INBOUND_DELIVERY = 'InboundDelivery';

export default async function InboundOrOutboundDeliveryIssueAllReceiveAll(context, bindingObject) {
    const binding = bindingObject || context.binding;
    return InboundOutboundDeliveryReceiveAllIssueAllIsAllowed(context, binding).then((allowed) => {
        const type = binding['@odata.type'].substring('#sap_mobile.'.length);
        const isIBD = (type === INBOUND_DELIVERY);
        if (allowed) {
            return comLib.navigateOnRead(context.getPageProxy(), 
                                         getInboundOrOutboundReceiveAllIssueAllWarningAction(isIBD), binding['@odata.readLink'], 
                                         isIBD ? '$expand=MyInventoryObject_Nav' : '$expand=MyInventoryObject_Nav,Customer_Nav');
        }
        return context.executeAction(getInboundOrOutboundReceiveAllIssueAllInformationAction(isIBD));
    });
}

function getInboundOrOutboundReceiveAllIssueAllWarningAction(isIBD) {
    const actionName = isIBD ? '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryReceiveAllConfirmation.action' : '/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryIssueAllConfirmation.action';
    const onOk = isIBD ? '/SAPAssetManager/Rules/Inventory/InboundDelivery/SetGoodsReceiptInboundDeliveryWithItems.js' : '/SAPAssetManager/Rules/Inventory/OutboundDelivery/SetGoodsReceiptOutboundDeliveryWithItems.js';
    return ({
        'Name': actionName,
        'Properties': {
            'CancelCaption': '$(L,cancel)',
            'OnOK': onOk,
        },
    });
}

function getInboundOrOutboundReceiveAllIssueAllInformationAction(isIBD) {
    const actionName = isIBD ? '/SAPAssetManager/Actions/Inventory/InboundDelivery/InboundDeliveryReceiveAllConfirmation.action' : '/SAPAssetManager/Actions/Inventory/OutboundDelivery/OutboundDeliveryIssueAllConfirmation.action';
    return ({
        'Name': actionName,
        'Properties': {
            'Message': '$(L, incomplete_delivery_information)',
            'OKCaption': '$(L,ok)',
        },
    });
}
