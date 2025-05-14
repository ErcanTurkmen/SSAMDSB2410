import OperationFormInstancesCount from './OperationFormInstancesCount';

export default function FSMFormsListFooterVisible(context) {
    return OperationFormInstancesCount(context).then(count => count > 2);
}
