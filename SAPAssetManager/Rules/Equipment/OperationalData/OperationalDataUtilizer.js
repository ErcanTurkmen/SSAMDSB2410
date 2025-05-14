import { ValueIfExists } from '../../Common/Library/Formatter';

export default function OperationalDataUtilizer(context) {
    return ValueIfExists(context.binding.MyEquipOpData_Nav?.Utilizer); 
}
