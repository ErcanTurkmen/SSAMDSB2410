import libCom from '../Common/Library/CommonLibrary';

export default function PartsIssueEDTQueryOptions(context) {
    const inPartsList = libCom.getStateVariable(context, 'InPartsList');
    const filterPartsList = [];
    const filterBase = [];

    for (const part of inPartsList) {
        filterPartsList.push(`MaterialNum eq '${part}'`);
    }

    if (context.binding.OrderId) {
        filterBase.push(`OrderId eq '${context.binding.OrderId}'`);
    }

    if (context.binding.OperationNo) {
        filterBase.push(`OperationNo eq '${context.binding.OperationNo}'`);
    }

    return `$filter=(${filterBase.join(' and ')} and (${filterPartsList.join (' or ')}))&$expand=Material,MaterialBatch_Nav`;
}
