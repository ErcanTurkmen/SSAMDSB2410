import { FormatIdDescription } from '../../Common/Library/Formatter';

export default function OperationalDataSite(context) {
    return FormatIdDescription(context.binding.MyEquipOpData_Nav?.SiteId, context.binding.MyEquipOpData_Nav?.SiteDescription); 
}
