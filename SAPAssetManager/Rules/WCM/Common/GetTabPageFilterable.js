
/** @param {IPageProxy} context */
export default function GetTabPageFilterable(context) {
    const tabControl = context.getPageProxy().getControls().find(i => i.getType() === 'Control.Type.Tabs');
    const currentTabPageName = tabControl.tabItems[tabControl.getSelectedTabItemIndex()]._control.definition()._pageMetadata._Name;
    const tabPage = context.evaluateTargetPathForAPI(`#Page:${currentTabPageName}`);
    return tabPage.getControls().find(i => i.getType() === 'Control.Type.SectionedTable')._context.element;
}
