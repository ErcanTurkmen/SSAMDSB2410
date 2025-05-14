import IsFromOnlineEquipCreate from './IsFromOnlineEquipCreate';
import IsFromOnlineFlocCreate from './IsFromOnlineFlocCreate';

export default function IsNotFromOnlineCreate(context) {
    return !IsFromOnlineFlocCreate(context) && !IsFromOnlineEquipCreate(context);
}
