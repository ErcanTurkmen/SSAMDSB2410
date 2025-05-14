import ExecuteNavToOnlineSearchPage from '../ExecuteNavToOnlineSearchPage';

/**
* Navigates to Online Search page with 'Equipment' tab preselected
* @param {IClientAPI} context
*/
export default function OnlineSearchFromEquipmentNav(context) {
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    return ExecuteNavToOnlineSearchPage(context, equipmentTabName);

}
