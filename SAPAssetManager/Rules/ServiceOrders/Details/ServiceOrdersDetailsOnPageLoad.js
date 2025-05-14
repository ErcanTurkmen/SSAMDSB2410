import DetailsPageToolbarVisibility from '../../Common/DetailsPageToolbar/DetailsPageToolbarVisibility';
import ToolbarUpdateVisibility from '../../Common/DetailsPageToolbar/ToolbarUpdateVisibility';
import libCom from '../../Common/Library/CommonLibrary';
import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import S4ServiceLibrary from '../S4ServiceLibrary';
import RedrawS4ItemsEDTPage from '../ServiceItems/EDT/RedrawS4ItemsEDTPage';

export default function ServiceOrdersDetailsOnPageLoad(context) {
    libCom.removeStateVariable(context, 'IgnoreToolbarUpdate');

    // Hide the action bar based if order is complete and set the flag indicating if action items are visible or not
    return S4ServiceLibrary.isServiceObjectCompleted(context)
        .then(isCompleted => {
            if (isCompleted) {
                context.setActionBarItemVisible(0, false);
            }
        })
        .then(() => DetailsPageToolbarVisibility(context))
        .then(visibility => ToolbarUpdateVisibility(context, visibility))
        .then(() => {
            if (PersonalizationPreferences.isServiceItemTableView(context)) {
                return RedrawS4ItemsEDTPage(context, 'ServiceItemsTableSection');
            }
            
            return true;
        });
}
