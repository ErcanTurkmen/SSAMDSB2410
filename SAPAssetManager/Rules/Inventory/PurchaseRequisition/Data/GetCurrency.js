import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetCurrency(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'CurrencyLstPkr');
}
