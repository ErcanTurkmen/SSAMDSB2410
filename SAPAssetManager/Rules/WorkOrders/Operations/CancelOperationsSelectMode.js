import CommonLibrary from '../../Common/Library/CommonLibrary';
import OperationsListViewChangeMode from './OperationsListViewChangeMode';

export default function CancelOperationsSelectMode(context) {
    return OperationsListViewChangeMode(context).finally(() => {
        CommonLibrary.setStateVariable(context, 'firstOpenMultiSelectMode', true);
    });
}
