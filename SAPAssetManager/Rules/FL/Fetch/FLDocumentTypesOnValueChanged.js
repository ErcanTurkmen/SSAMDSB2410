import { FLDocumentTypeValues } from '../Common/FLLibrary';

/**
 * Sets the visibility of different fetch sections based on the value of the DocumentTypeListPicker.
 * @param {*} context 
 */
export default function FLDocumentTypesOnValueChanged(context) {
    const sectionTableProxy = context.getPageProxy().getControl('SectionedTable');
    const documentTypeValue = sectionTableProxy.getSection('FetchDefaultSection').getControl('DocumentTypeListPicker').getValue()?.[0]?.ReturnValue;
    sectionTableProxy.getSection('FetchVoyagesSection').setVisible(documentTypeValue === FLDocumentTypeValues.Voyage);
}
