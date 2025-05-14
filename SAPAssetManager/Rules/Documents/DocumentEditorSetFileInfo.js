
export default function DocumentEditorSetFileInfo(context, info) {
    const clientData = context.evaluateTargetPath('#Application/#ClientData');
    clientData.DocumentFileInfo = info;
}
