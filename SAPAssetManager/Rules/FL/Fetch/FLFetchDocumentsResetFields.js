import FLSetDefaultPlant from './FLSetDefaultPlant';
import libCom from '../../Common/Library/CommonLibrary';

/**
 * Reset the fields in the Fetch Documents screen. Resetting document type picker should implicitly reset visibility of other fetch sections.
 * @param {*} context 
 */
export default function FLFetchDocumentsResetFields(context) {
    const sectionTableProxy = context.getPageProxy().getControl('SectionedTable');
    const defaultSection = sectionTableProxy.getSection('FetchDefaultSection');
    const [documentTypeListPicker, plantLstPkr] = ['DocumentTypeListPicker', 'PlantListPicker'].map((control) => defaultSection.getControl(control));
    documentTypeListPicker.setValue('');
    plantLstPkr.setValue(FLSetDefaultPlant());
    libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
}
