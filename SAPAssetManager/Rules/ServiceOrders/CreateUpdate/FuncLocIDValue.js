import SOControlsLib from '../S4ServiceOrderControlsLibrary';
import SRControlsLib from '../S4ServiceRequestControlsLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import S4ServiceQuotationControlsLibrary from '../S4ServiceQuotationControlsLibrary';

export default function FuncLocIDValue(context) {
    if (libCommon.getPageName(context) === 'ServiceRequestCreateUpdatePage') {
        return SRControlsLib.getFunctionalLocationValue(context);
    }
    if (libCommon.getPageName(context) === 'ServiceQuotationCreateUpdatePage') {
        return S4ServiceQuotationControlsLibrary.getFunctionalLocationValue(context);
    }
    return SOControlsLib.getFunctionalLocationValue(context);
}
