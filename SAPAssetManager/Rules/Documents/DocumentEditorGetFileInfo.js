
export default function DocumentEditorGetFileInfo(context) {
    const clientData = context.evaluateTargetPath('#Application/#ClientData');
    return clientData.DocumentFileInfo;
}
