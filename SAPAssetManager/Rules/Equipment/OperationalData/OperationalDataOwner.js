import { FormatIdDescription } from '../../Common/Library/Formatter';

export default function OperationalDataOwner(context) {
    return FormatIdDescription(context.binding.MyEquipOpData_Nav?.Owner, context.binding.MyEquipOpData_Nav?.OwnerDescription); 
}
