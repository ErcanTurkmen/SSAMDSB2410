import showMaterialTransferToFields from './ShowMaterialTransferToFields';
import showBatch from './ShowMaterialBatchField';

export default function ShowTransferToBatchField(context) {
    return showBatch(context).then(function(show) {
        return (showMaterialTransferToFields(context) && show);
    });
}
