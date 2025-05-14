import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetPlant(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'PlantLstPkr');
}
