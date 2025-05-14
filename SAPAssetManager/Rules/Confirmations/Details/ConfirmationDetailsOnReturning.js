import { redrawToolbar } from '../../Common/DetailsPageToolbar/ToolbarRefresh';

export default function ConfirmationDetailsOnReturning(clientAPI) {
    let sectionedTableProxy = clientAPI.getControls()[0];
    sectionedTableProxy.redraw();
    redrawToolbar(clientAPI.getPageProxy());
}
