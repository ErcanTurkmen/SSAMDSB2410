import Logger from '../../Log/Logger';
export default function PurchaseOrderItemLongText(context, item) {
  let textkey = item.PurchaseOrderId + item.ItemNum;
  let querytxt = `$filter=(ObjectKey eq '${textkey}' and TextObjType eq 'EKPO')`;

  return context.read('/SAPAssetManager/Services/AssetManager.service', 'PurchaseOrderHeaderLongTexts', ['TextString'], querytxt).then(results => {
    if (results && results.length > 0) {
      return results.getItem(0).TextString;
    } else {
      return ' ';
    }
  }).catch(err => {
    Logger.error('Missing PO Text', err);
    return ' ';
  });
}
