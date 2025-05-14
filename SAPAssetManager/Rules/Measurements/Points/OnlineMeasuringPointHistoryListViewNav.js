import libVal from '../../Common/Library/ValidationLibrary';
export default function OnlineMeasuringPointHistoryListViewNav(clientAPI) {
    if (!libVal.evalIsEmpty(clientAPI.binding.CodeGroup)) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Measurements/OnlineMeasuringPointHistoryListViewWithValCodeNav.action');
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Measurements/OnlineMeasuringPointHistoryListViewNav.action');
    }
}
