import { FormatIdDescription } from '../../Common/Library/Formatter';

export default function OperationalDataModelId(context) {
    return FormatIdDescription(context.binding.MyEquipOpData_Nav?.ModelId, context.binding.MyEquipOpData_Nav?.ModelDescr); 
}
