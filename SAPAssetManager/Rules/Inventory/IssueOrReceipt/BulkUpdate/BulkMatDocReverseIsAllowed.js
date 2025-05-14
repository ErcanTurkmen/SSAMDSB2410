
// To allow reverse all only if there is atleast 1 item that is not reversed
export default function BulkMatDocReverseIsAllowed(context, pageProxy, actionContext) {
 const matDocNumber = actionContext?.MaterialDocument_Nav?.MaterialDocNumber || pageProxy?.getBindingObject()?.MaterialDocNumber || context.binding?.MaterialDocNumber;
 const matDocYear = actionContext?.MaterialDocument_Nav?.MaterialDocYear || pageProxy?.getBindingObject()?.MaterialDocYear || context.binding?.MaterialDocYear;
 const query = `$filter=ReferenceDocHdr eq '${matDocNumber}' and ReferenceDocYear eq '${matDocYear}'`;
 const queryMat = `$filter=MaterialDocNumber eq '${matDocNumber}' and MaterialDocYear eq '${matDocYear}'`;
 const docItems = context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], queryMat);
 const reverseItems= context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], query);
 return Promise.all([docItems, reverseItems]).then(([items, reverseDocs]) =>{
    return items.length !== reverseDocs.length;
 });
}

