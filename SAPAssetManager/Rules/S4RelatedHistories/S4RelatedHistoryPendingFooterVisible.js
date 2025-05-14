import S4RelatedHistoryPendingCount from './S4RelatedHistoryPendingCount';

export default function S4RelatedHistoryPendingFooterVisible(context) {
    return S4RelatedHistoryPendingCount(context).then(count => {
        return count > 3;
    });
}
