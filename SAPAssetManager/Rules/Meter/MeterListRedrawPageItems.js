import { redrawToolbar } from '../Common/DetailsPageToolbar/ToolbarRefresh';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function MeterListRedrawPageItems(context) {
    const pageProxy = context.getPageProxy();
    const isMultipleMode = pageProxy.getControl('SectionedTable')?.getSections()[0].getSelectionMode() !== 'Multiple';
    redrawActionBarItems(context, isMultipleMode);
    return redrawList(context);
}

export function redrawActionBarItems(context, isMultipleMode) {
    const pageProxy = context.getPageProxy();
    pageProxy.setActionBarItemVisible('DoneSelect', !isMultipleMode);
    pageProxy.setActionBarItemVisible('SelectToRemove', !!isMultipleMode);
}

export function redrawList(context) {
    const pageProxy = context.getPageProxy();
    const tableSection = pageProxy.getControls()[0].getSections()[0];

    return tableSection.redraw().finally(() => {
        return redrawToolbar(pageProxy);
    });
}
