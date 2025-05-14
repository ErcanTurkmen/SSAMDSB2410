import { FormatIdDescription } from '../../Common/Library/Formatter';

export default function OperationalDataForce(context) {
    return FormatIdDescription(context.binding.MyEquipOpData_Nav?.MatlplngObjId, context.binding.MyEquipOpData_Nav?.MatlplngObjDscr); 
}
