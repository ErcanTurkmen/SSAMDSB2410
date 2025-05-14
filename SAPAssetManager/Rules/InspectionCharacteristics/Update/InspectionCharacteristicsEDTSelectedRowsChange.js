import ToolbarUpdateVisibility from '../../Common/DetailsPageToolbar/ToolbarUpdateVisibility';
import libCom from '../../Common/Library/CommonLibrary';

export default function InspectionCharacteristicsEDTSelectedRowsChange(context) {
    const pageProxy = context.getPageProxy();
    
    if (pageProxy) {
        //Handle multiple EDT extensions on the page.  The Index is the zero based extension number.  Each extension takes up 2 sections on the page
        let bulkExtensionIndex = (2 * context._control.getUserData().Index) + 1;
        const extension = pageProxy._page.controls[0].sections[bulkExtensionIndex].extensions[0];

        if (extension) {
            const masterRowIndex = extension.getSelectedMasterRowIndex();

            if (masterRowIndex !== undefined && masterRowIndex >= 0) libCom.setStateVariable(context, 'bulkExtensionIndex', bulkExtensionIndex);
            return ToolbarUpdateVisibility(pageProxy, masterRowIndex !== undefined && masterRowIndex >= 0);
        }
        return ToolbarUpdateVisibility(pageProxy, false);
    }
}
