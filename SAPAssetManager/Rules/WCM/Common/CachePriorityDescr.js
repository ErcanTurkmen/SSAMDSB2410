import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function CachePriorityDescr(context, clientData) {
    if (clientData.Priorities === undefined) {
        return CommonLibrary.cacheEntity(context, 'Priorities', '$select=Priority,PriorityDescription', ['Priority'], ['PriorityDescription'], clientData);
    }
}
