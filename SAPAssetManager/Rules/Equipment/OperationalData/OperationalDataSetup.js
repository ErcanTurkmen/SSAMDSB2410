import { ValueIfExists } from '../../Common/Library/Formatter';

export default function OperationalDataSetup(context) {
    return ValueIfExists(context.binding.MyEquipOpData_Nav?.Setup); 
}
