import { FormatIdDescription } from '../../Common/Library/Formatter';

export default function OperationalDataRic(context) {
    return FormatIdDescription(context.binding.MyEquipOpData_Nav?.ObjRicId, context.binding.MyEquipOpData_Nav?.ObjRicDescr); 
}
