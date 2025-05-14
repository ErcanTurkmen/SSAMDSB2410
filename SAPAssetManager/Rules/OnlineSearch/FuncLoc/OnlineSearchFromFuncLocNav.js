import ExecuteNavToOnlineSearchPage from '../ExecuteNavToOnlineSearchPage';

/**
* Navigates to Online Search page with 'Functional Location' tab preselected
* @param {IClientAPI} context
*/
export default function OnlineSearchFromFuncLocNav(context) {
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();
    return ExecuteNavToOnlineSearchPage(context, funcLocTabName);

}
