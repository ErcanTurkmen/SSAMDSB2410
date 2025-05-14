
export default function OnlineDocumentListViewCaption(context) {
    const count = context.binding.Document?.length || context.binding.FuncLocDocument?.length;
    return count ?
        context.localizeText('documents_x', [count]) :
        context.localizeText('documents');
}
