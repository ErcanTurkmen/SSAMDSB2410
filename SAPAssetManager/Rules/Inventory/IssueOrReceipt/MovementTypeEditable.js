import libCom from '../../Common/Library/CommonLibrary';
import MovementTypeQueryOptions from './MovementTypeQueryOptions';

export default function MovementTypeEditable(context) {
    let movementType = libCom.getStateVariable(context, 'CurrentDocsItemsMovementType');
    if (movementType) {
        return false;
    }
    const filter = MovementTypeQueryOptions(context);
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MovementTypes', filter);
}
