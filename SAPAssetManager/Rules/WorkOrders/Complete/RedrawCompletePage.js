import SmartFormsCompletionLibrary from '../../Forms/SmartFormsCompletionLibrary';

export default function RedrawCompletePage(context) {
    context.dismissActivityIndicator(); //Fix for 24408 - JCL
    const page = context.getPageProxy();
    const controls = page.getControls() || [];
    const sectionedTable = controls[0];
    if (sectionedTable) {
        SmartFormsCompletionLibrary.updateSmartFormsValidation(page).then(() => {
            return sectionedTable.redraw();
        });
    }
}
