import EnableEquipmentEdit from '../../UserAuthorizations/Equipments/EnableEquipmentEdit';
import UninstallVisible from '../Uninstall/UninstallVisible';

export default function IsSubEquipmentPopoverVisible(context) {
    return Promise.all([
        UninstallVisible(context),
        EnableEquipmentEdit(context),
    ]).then(results => results.some(i => !!i));
}
