/**
 * Show/hide Next/Previous task buttons
 * @param {ToolBarItemProxy} context 
 */
export default function IsVisiblePreviousNextButton(toolBarItemProxy) {
    // Hide the buttons if coming from the EWM Overview page
    return toolBarItemProxy.currentPage._definition.name !== 'EWMOverviewPage';
}
