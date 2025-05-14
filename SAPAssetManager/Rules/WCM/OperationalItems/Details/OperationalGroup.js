import libVal from '../../../Common/Library/ValidationLibrary';

export default function OperationalGroup(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service','WCMOpGroups',[],`$filter=OpGroup eq '${context.binding.OpGroup}'`)
    .then(data=>{
        if (!libVal.evalIsEmpty(data.getItem(0))) {
            return `${data.getItem(0).TextOpGroup} (${context.binding.OpGroup})`;
        }
        return '-';
    });
}

