import libCom from '../../Common/Library/CommonLibrary';

export default function PriorityVeryHighText(context) {
    return libCom.getEntityProperty(context, `Priorities(Priority='${context.getGlobalDefinition('/SAPAssetManager/Globals/Priorities/VeryHigh.global').getValue()}',PriorityType='PM')`, 'PriorityDescription');
}
