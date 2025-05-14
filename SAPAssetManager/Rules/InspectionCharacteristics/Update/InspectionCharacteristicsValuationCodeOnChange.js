import CommonLibrary from '../../Common/Library/CommonLibrary';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import InspectionCharacteristicsCommentIsEditable from './InspectionCharacteristicsCommentIsEditable';

export default function InspectionCharacteristicsValuationCodeOnChange(context) {
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    if (section && Object.prototype.hasOwnProperty.call(section,'index') && section.index !== -1) {
        let index = section.index;
        let valCtrl = context.getPageProxy().getControls()[0].sections[index].getControl('Valuation');
        let valReadLink = CommonLibrary.getControlValue(valCtrl);
        if (valReadLink) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', valReadLink, [], '').then(result => {
                if (result && result.getItem(0)) {
                    switch (result.getItem(0).Valuation) {
                        case 'A':
                            valCtrl.setStyle('AcceptedGreen','Value');
                            break;
                        case 'R':
                        case 'F':
                            valCtrl.setStyle('RejectedRed','Value');
                            break;
                        default:
                            valCtrl.setStyle('GrayText','Value');
                    }
                    context.getPageProxy().getControl('FormCellContainer').redraw();
                    context.clearValidation();
    
                    setCommentEditable(context.getPageProxy().getControls()[0].sections[index], section, result.getItem(0).Valuation);
                }
            }); 
        } else {
            valCtrl.setStyle('GrayText','Value');
            context.getPageProxy().getControl('FormCellContainer').redraw();
            context.clearValidation();
        }
    }
}

function setCommentEditable(pageContext, section, newValuation) {
    let commentCtrl = pageContext.getControl('ShortTextComment');
    InspectionCharacteristicsCommentIsEditable(section, newValuation).then(isEditable => {
        commentCtrl.setEditable(isEditable);
    });
}
