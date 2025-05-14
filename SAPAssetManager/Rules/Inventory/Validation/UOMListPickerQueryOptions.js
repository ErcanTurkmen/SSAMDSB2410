import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function UOMListPickerQueryOptions(context) {
    if (context.binding) {
        const binding = context.binding;
        let material = binding.MaterialNum || binding.Material;
        return material ? `$filter=MaterialNum eq '${material}'&$orderby=BaseUOM,UOM` : '';
    } else {
        try {
            let materialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
            let materialReadLink = materialListPicker.getValue()[0].ReturnValue;
            if (materialReadLink && materialReadLink.length > 0) {
                let material = SplitReadLink(materialReadLink).MaterialNum;
                libCom.setStateVariable(context, 'Material', material);
                return `$filter=MaterialNum eq '${material}'&$orderby=BaseUOM,UOM`;
            }
        } catch (error) { //Control will be empty during intial page load
            Logger.error('UOM', error);
            return '';
        }
    }
    return '';
}

