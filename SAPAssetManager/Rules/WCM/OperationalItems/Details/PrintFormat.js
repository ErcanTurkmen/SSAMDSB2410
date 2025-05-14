import libVal from '../../../Common/Library/ValidationLibrary';

export default function PrintFormat(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service','WCMPrintFormatTags',[],`$filter=PrintFormat eq '${context.binding.PrintFormatTag}'`)
    .then(data=>{
        if (!libVal.evalIsEmpty(data.getItem(0))) {
            return `${data.getItem(0).ShortText} (${context.binding.PrintFormatTag})`;
        }
        return '-';
    });
}
