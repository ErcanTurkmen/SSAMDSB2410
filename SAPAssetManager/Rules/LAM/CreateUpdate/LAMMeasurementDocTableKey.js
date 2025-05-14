
import generateID from '../../Common/GenerateLocalID';

export default function LAMMeasurementDocTableKey(context, offset = 0) {
   return generateID(context, 'LAMObjectData', 'TableKey', '000000000000000000000000', '$filter=startswith(TableKey,\'LOCAL_\') eq true', 'LOCAL_', '', offset);
}
