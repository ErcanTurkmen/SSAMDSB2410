import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetStorageLocation(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'StorageLocationLstPkr', 'link', 'StorageLocation');
}
