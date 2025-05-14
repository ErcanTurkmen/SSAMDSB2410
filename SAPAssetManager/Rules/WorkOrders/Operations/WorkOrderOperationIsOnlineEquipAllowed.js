import IsFromOnlineEquipCreate from '../../Common/IsFromOnlineEquipCreate';
import WorkOrderOperationIsEquipFuncLocAllowed from './WorkOrderOperationIsEquipFuncLocAllowed';

export default function WorkOrderOperationIsOnlineEquipAllowed(context) {
    return WorkOrderOperationIsEquipFuncLocAllowed(context).then(isAllowed => {
        return isAllowed && IsFromOnlineEquipCreate(context);
    });
}
