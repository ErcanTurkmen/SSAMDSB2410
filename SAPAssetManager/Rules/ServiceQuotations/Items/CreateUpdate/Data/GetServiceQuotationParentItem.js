import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function GetServiceQuotationParentItem(context) {
    const parentItemControlValue = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ParentQuotationItemLstPkr'));

    return parentItemControlValue.padStart(10, 0);
}
