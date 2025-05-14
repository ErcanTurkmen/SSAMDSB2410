import GenerateLocalID from '../../../Common/GenerateLocalID';
import { SubOperationControlLibrary as libSubOpControl } from '../../../SubOperations/SubOperationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';

export default function SubOperationLocalID(context) {
    const binding = context.binding || {};
    if (binding.SubOperationNo) {
        return Promise.resolve(binding.SubOperationNo);
    }

    const operationReadLink = binding['@odata.readLink'] || libSubOpControl.getOperation(context);
    return GenerateLocalID(context, operationReadLink + '/SubOperations', 'SubOperationNo', '000', "$filter=startswith(SubOperationNo, 'L') eq true", 'L')
        .then((localID) => {
            //Save local sub-operation id into state variable.
            libCom.setStateVariable(context, 'localSubOperationId', localID);
            return localID;
        });
}

