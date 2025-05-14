import SOControlsLib from '../S4ServiceOrderControlsLibrary';
import SRControlsLib from '../S4ServiceRequestControlsLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import S4ServiceQuotationControlsLibrary from '../S4ServiceQuotationControlsLibrary';

export default function EquipIDValue(context) {
    if (libCommon.getPageName(context) === 'ServiceRequestCreateUpdatePage') {
        return SRControlsLib.getEquipmentValue(context);
    }
    if (libCommon.getPageName(context) === 'ServiceQuotationCreateUpdatePage') {
        return S4ServiceQuotationControlsLibrary.getEquipmentValue(context);
    }
    return SOControlsLib.getEquipmentValue(context);
}
