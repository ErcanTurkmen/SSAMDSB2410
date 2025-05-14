import RefreshSoftInputModeConfig from '../Common/RefreshSoftInputModeConfig';

export default function RefreshOverviewPage(clientAPI) {
    RefreshSoftInputModeConfig(clientAPI);
    clientAPI.getControls()[0].redraw();
}
