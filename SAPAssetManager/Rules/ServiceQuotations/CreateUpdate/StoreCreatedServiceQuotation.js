import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function StoreCreatedServiceQuotation(context) {
    const actionResult = context.getActionResult('ServiceQuotationCreateResult');
    const dataObject = JSON.parse(actionResult.data);
    CommonLibrary.setStateVariable(context, 'LocalId', dataObject.ObjectID);
}
