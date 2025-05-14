import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import {FDCSectionHelper} from '../../../FDC/DynamicPageGenerator';

export default function InspectionPointsCreateLinks(context) {
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    let links = [];
    if (section && Object.prototype.hasOwnProperty.call(section,'index') && section.index !== -1) {
        let pageName = libCom.getStateVariable(context, 'FDCPreviousPage');
        let SectionBindings = context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().SectionBindings;
        let binding = SectionBindings[section.index];
        if (Object.prototype.hasOwnProperty.call(binding,'InspCode_Nav') && libVal.evalIsEmpty(binding.InspCode_Nav)) {
            links.push({
                'Property': 'InspCode_Nav',
                'Target': {
                    'EntitySet': 'InspectionCodes',
                    'ReadLink': `InspectionCodes(Plant='${binding.ClientData.Plant}',SelectedSet='${binding.ClientData.ValSelectedSet}',Catalog='${context.binding.ClientData.ValCatalog}',CodeGroup='${context.binding.ClientData.ValCodeGroup}',Code='${context.binding.ClientData.ValCode}')`,
                },
            });
        }

        if (Object.prototype.hasOwnProperty.call(context.binding,'InspValuation_Nav') && libVal.evalIsEmpty(binding.InspValuation_Nav)) {
            links.push({
                'Property': 'InspValuation_Nav',
                'Target': {
                    'EntitySet': 'InspectionCatalogValuations',
                    'ReadLink': `InspectionCatalogValuations('${binding.ClientData.Valuation}')`,
                },
            });
        }
    }
    return links;
}
