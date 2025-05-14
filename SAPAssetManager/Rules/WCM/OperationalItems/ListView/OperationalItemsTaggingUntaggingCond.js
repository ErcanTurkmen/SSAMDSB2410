import { IsOperationalItemInUntagging } from '../libWCMDocumentItem';

export default function OperationalItemsTaggingUntaggingCond(context) {
    return IsOperationalItemInUntagging(context).then((isUntagging) => {
        const opCondition = context.binding[`${isUntagging ? 'UntagCond' : 'TaggingCond'}`]; 

        if (!opCondition) {
            return Promise.resolve('-');
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', `WCMOpConditions('${opCondition}')`, ['OpConditionText'], '').then((data) => {
            return data.getItem(0) ? data.getItem(0).OpConditionText : '-';
        });
    });
}
