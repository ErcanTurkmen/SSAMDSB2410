import { ValueIfExists } from '../../Common/Library/Formatter';

export default function OperationalDataTailId(context) {
    return ValueIfExists(context.binding.MyEquipOpData_Nav?.TailId); 
}
