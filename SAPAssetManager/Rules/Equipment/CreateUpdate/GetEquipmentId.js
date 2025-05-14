import EquipmentLocalID from './EquipmentGenerateLocalId';

export default function GetEquipmentId(control) {
    if (control.binding && control.binding.EquipId) { 
        return control.binding.EquipId;
    } else {
        return EquipmentLocalID(control);
    }
}
