import libVal from '../Common/Library/ValidationLibrary';

export default function OnlineClassificationListQueryOptions(context) {
    let classes;

    if (context.binding.Class) {
        classes = context.binding.Class;
    } else if (context.binding.FuncLocClass) {
        classes = context.binding.FuncLocClass;
    }

    let classIds = classes ? classes.map(c => `ClassId eq '${c.ClassId}'`) : [];
    let classTypes = classes ? classes.map(c => `ClassType eq '${c.ClassType}'`) : [];

    const filter = !libVal.evalIsEmpty(classIds) ? `$filter=(${classIds.join(' or ')}) and (${classTypes.join(' or ')})&` : '';
    return `${filter}$expand=ClassCharacteristics`;
}
