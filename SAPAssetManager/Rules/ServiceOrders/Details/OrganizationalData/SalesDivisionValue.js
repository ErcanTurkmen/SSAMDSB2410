import libCom from '../../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function SalesDivisionValue(context) {
    let division = context.binding.Division;
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem' && context.binding.S4ServiceOrder_Nav) {
        division = context.binding.S4ServiceOrder_Nav.Division; 
    }
    
    if (!libCom.isDefined(division)) {
        return ValueIfExists('');
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Divisions', [], `$filter=Division eq '${division}'`).then((result) => {
        if (result.length) {
            return ValueIfExists(`${division} ${result.getItem(0).Description}`); 
        }
        return ValueIfExists(division);
    });
}
