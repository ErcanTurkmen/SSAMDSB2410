import libCom from '../Common/Library/CommonLibrary';
import libSearch from './OnlineSearchLibrary';

export default function OnlineSearchOnReturn(context) {
    if (libCom.getStateVariable(context, 'UpdateOnlineListOnReturn')) {
        const listPageProxy = libSearch.getCurrentTabPage(context);
        return listPageProxy.getControl('SectionedTable').redraw().finally(() => {
            libCom.removeStateVariable(context, 'UpdateOnlineListOnReturn');
        });
    }
}
