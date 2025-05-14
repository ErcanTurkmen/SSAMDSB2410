import { ValueIfExists } from '../../Common/Library/Formatter';

export default function OperationalDataRemark(context) {
    return ValueIfExists(context.binding.MyEquipOpData_Nav?.Remark); 
}
