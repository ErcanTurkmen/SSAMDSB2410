import logger from '../../../Log/Logger';
import { GetNextPreviousTask, IsFirst, IsLast } from './TaskArray';

/**
 * Handler for the Next/Previous task buttons
 * @param {ToolBarItemProxy} context 
 */
export default function OnPressPreviousNextButton(toolBarItemProxy) {
    const isNext = toolBarItemProxy._control.name === 'NextTask';
    return GeNextPreviousOrderTask(toolBarItemProxy, isNext);
}

/**
 * Read data for the nex/prev task and unbdate bindings
 * @param {ToolBarItemProxy} toolBarItemProxy 
 * @param {Boolean} next - true is next, fals - previous
 * @returns 
 */
async function GeNextPreviousOrderTask(toolBarItemProxy, next = true) {
    const pageProxy = toolBarItemProxy.getPageProxy();
    try {
        pageProxy.showActivityIndicator();
        const entitySet = 'WarehouseTasks';
        const task = GetNextPreviousTask(pageProxy, pageProxy.binding.WarehouseTask, next);
        const queryOptions = `$filter=WarehouseOrder eq '${task.WarehouseOrder}' and WarehouseTask eq '${task.WarehouseTask}'`;
        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(async (result) => {
            const newTask = result.getItem(0);
            const toolbar = pageProxy.getToolbar();
            const toolbarControls = toolbar.getToolbarItems();

            // update prev/next buttons state
            const buttonPrevious = toolbarControls.find(item => item._control.name === 'PreviousTask');
            const buttonNext = toolbarControls.find(item => item._control.name === 'NextTask');
            await buttonPrevious._item.setEnabled(!IsFirst(pageProxy, newTask.WarehouseTask));
            await buttonNext._item.setEnabled(!IsLast(pageProxy, newTask.WarehouseTask));

            const sectionedTable = pageProxy.getControl('SectionedTable');

            // update to new task binding
            pageProxy._context.binding = newTask;
            sectionedTable._context.binding = pageProxy._context.binding;
            toolbar._context.binding = pageProxy._context.binding;
            toolbarControls.forEach(item => {
                if (item._context) {
                    item._context.binding = pageProxy._context.binding;
                    item.redraw();
                }
            });
            return Promise.resolve(sectionedTable.redraw()).then(() => { });
        });
    } catch (error) {
        logger.error('EWM Task Details - GetNextPreviousOrderTask error: ' + error);
    } finally {
        pageProxy.dismissActivityIndicator();
    }
}
