import ValidationLibrary from '../Common/Library/ValidationLibrary';
import lamIsEnabled from '../LAM/LAMIsEnabled';

export default function CheckIsLam(context, confirmRow) {
    if (!lamIsEnabled(context)) {
        return Promise.resolve('');
    }
    const op = confirmRow.Operation;
    const order = confirmRow.OrderID;
    //Read the operation row and its parent WO.  Work up the hierarchy looking for the first LAM record to use as a default
    const expand = '$expand=LAMObjectDatum_Nav,EquipmentOperation,FunctionalLocationOperation,EquipmentOperation/LAMObjectDatum_Nav,FunctionalLocationOperation/LAMObjectDatum_Nav,WOHeader,WOHeader/LAMObjectDatum_Nav,WOHeader/Equipment,WOHeader/Equipment/LAMObjectDatum_Nav,WOHeader/FunctionalLocation,WOHeader/FunctionalLocation/LAMObjectDatum_Nav';
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OperationNo='${op}',OrderId='${order}')`, ['OperationNo'], expand).then((/** @type {ObservableArray<MyWorkOrderOperation>} */ opResults) => {
        if (ValidationLibrary.evalIsEmpty(opResults)) {
            return '';
        }
        const opRow = opResults.getItem(0);
        if (opRow.LAMObjectDatum_Nav && opRow.LAMObjectDatum_Nav.StartPoint !== '' && opRow.LAMObjectDatum_Nav.EndPoint !== '' && opRow.LAMObjectDatum_Nav.Length !== '') { // Ignore bogus LAM entries
            return opRow.LAMObjectDatum_Nav;
        } else if (opRow.EquipmentOperation?.LAMObjectDatum_Nav) {
            return opRow.EquipmentOperation.LAMObjectDatum_Nav;
        } else if (opRow.FunctionalLocationOperation?.LAMObjectDatum_Nav) {
            return opRow.FunctionalLocationOperation.LAMObjectDatum_Nav;
        } else if (opRow.WOHeader && opRow.WOHeader.LAMObjectDatum_Nav && opRow.WOHeader.LAMObjectDatum_Nav.length > 0) {
            const foundDatum = opRow.WOHeader.LAMObjectDatum_Nav.find(tempRow => tempRow.ObjectType === 'OR' && tempRow.StartPoint !== '' && tempRow.EndPoint !== '' && tempRow.Length !== '');  //Find the header row, Ignore bogus LAM entries
            if (foundDatum) {
                return foundDatum;
            }
        }

        if (opRow.WOHeader?.Equipment?.LAMObjectDatum_Nav) {
            return opRow.WOHeader.Equipment.LAMObjectDatum_Nav;
        } else if (opRow.WOHeader?.FunctionalLocation?.LAMObjectDatum_Nav) {
            return opRow.WOHeader.FunctionalLocation.LAMObjectDatum_Nav;
        }

        return '';
    });
}
