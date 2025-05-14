import S4RelatedHistoryRecentCount from './S4RelatedHistoryRecentCount';

export default function S4RelatedHistoryRecentFooterVisible(context) {
    return S4RelatedHistoryRecentCount(context).then(count => {
        return count > 3;
    });
}
