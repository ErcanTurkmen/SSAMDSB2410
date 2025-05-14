import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import {FDCSectionHelper} from '../../../FDC/DynamicPageGenerator';

export default function InspectionPointSetValuation(context) {
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    if (section && Object.prototype.hasOwnProperty.call(section,'index') && section.index !== -1) {
        let pageName = libCom.getStateVariable(context, 'FDCPreviousPage');
        let SectionBindings = context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().SectionBindings;
        let binding = SectionBindings[section.index];
        ResetValidationOnInput(context);
        if (!libVal.evalIsEmpty(context.getValue()[0])) {
            let readlink = context.getValue()[0].ReturnValue;
            return context.read('/SAPAssetManager/Services/AssetManager.service', readlink, [], '$expand=InspValuation_Nav').then((valuation) => {
                if (valuation.length > 0) {
                    let ClientData = {};
                    ClientData.Valuation = valuation.getItem(0).ValuationStatus;
                    ClientData.ValSelectedSet=valuation.getItem(0).SelectedSet;
                    ClientData.ValCatalog=valuation.getItem(0).Catalog;
                    ClientData.ValCode=valuation.getItem(0).Code;
                    ClientData.ValCodeGroup=valuation.getItem(0).CodeGroup;
                    ClientData.Plant=valuation.getItem(0).Plant;
                    binding.ClientData = ClientData;
                }
            });
        }
    }
}
