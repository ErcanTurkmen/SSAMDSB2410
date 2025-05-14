import EquipmentCount from './EquipmentCount';

export default function EquipmentsListFooterVisible(sectionProxy) {
    return EquipmentCount(sectionProxy).then((count) => {
        return count > 2;
    });
}
