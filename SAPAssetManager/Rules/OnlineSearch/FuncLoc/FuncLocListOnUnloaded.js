import ListViewToggleMode from '../ListViewToggleMode';

export default function FuncLocListOnUnloaded(context) {
    const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
    if (context.getControl('SectionedTable').getSections()[0].getSelectionMode() === 'Multiple') {
        return ListViewToggleMode(onlineSearchPage, context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue());
    }
}
