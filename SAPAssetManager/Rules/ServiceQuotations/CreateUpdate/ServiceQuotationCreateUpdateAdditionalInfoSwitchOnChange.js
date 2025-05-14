
export default function ServiceQuotationCreateUpdateAdditionalInfoSwitchOnChange(context) {
    const switchValue = context.getValue();
    const formCellContainer = context.getPageProxy().getControls()[0];
    if (formCellContainer) {
        const categorizationSection = formCellContainer.getSection('CategorizationSection');
        const referenceObjectSection = formCellContainer.getSection('ReferenceObjectSection');

        categorizationSection.setVisible(switchValue);
        referenceObjectSection.setVisible(switchValue);
    }
}
