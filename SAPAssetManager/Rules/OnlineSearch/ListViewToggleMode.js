import libCommon from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libSearch from './OnlineSearchLibrary';
import RedrawActionbarToolbar from './RedrawActionbarToolbar';

export default async function ListViewToggleMode(context, tab = '') {
    try {
        const id = context.showActivityIndicator();
        libCommon.setStateVariable(context, 'selectedItems', []);
        let listPageProxy = libSearch.getCurrentTabPage(context, tab);
        let objectTable = listPageProxy.getControl('SectionedTable').getSections()[0];
        
        if (objectTable.getSelectionMode() === 'Multiple') {
            objectTable.setSelectionMode('None');
        } else {
            objectTable.setSelectionMode('Multiple');
        }

        return redrawSelectionList(context, listPageProxy)
            .finally(() => {
                context.dismissActivityIndicator(id);
            });
    } catch (err) {
        context.dismissActivityIndicator();
        Logger.error('ListViewToggleMode', err);
    }
}

function redrawSelectionList(context, listPageProxy) {
    return listPageProxy.getControl('SectionedTable').redraw()
        .then(() => {
            return RedrawActionbarToolbar(context);
        });
}
