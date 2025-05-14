import WCMPriorityFilter from '../../Common/WCMPriorityFilter';

export default function OperationalItemsPriorityFilter(context) {
    return WCMPriorityFilter(context, 'WCMDocumentHeaders/');
}
