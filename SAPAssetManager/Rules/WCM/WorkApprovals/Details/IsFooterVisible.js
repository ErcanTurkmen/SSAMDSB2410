import GetRelatedObjectsCount from './GetRelatedObjectsCount';

export default function IsFooterVisible(context) {
    return GetRelatedObjectsCount(context).then((count) => {
        return count > 2;
    });
}
