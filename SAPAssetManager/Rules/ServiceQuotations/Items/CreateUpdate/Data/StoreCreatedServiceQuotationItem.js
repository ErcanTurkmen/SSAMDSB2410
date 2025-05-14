import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import Logger from '../../../../Log/Logger';

export default function StoreCreatedServiceQuotationItem(context) {
    const createdServiceQuotationItemData = context.getActionResult('ServiceQuotationItem')?.data;
    
    try {
        const createdServiceQuotationItem = JSON.parse(createdServiceQuotationItemData);
        if (createdServiceQuotationItem.ObjectID) {
            CommonLibrary.setStateVariable(context, 'LocalId', createdServiceQuotationItem.ObjectID);
        }
        if (createdServiceQuotationItem.ObjectType) { 
            CommonLibrary.setStateVariable(context, 'LocalObjectType', createdServiceQuotationItem.ObjectType);
        }
        CommonLibrary.setStateVariable(context, 'lastLocalItemId', createdServiceQuotationItem.ItemNo);
    } catch (error) {
        Logger.error('StoreCreatedServiceQuotationItem', error);
    }
}
