import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';

export default function NotificationCreateUpdateQMCodeGroupOnValueChange(listPickerProxy) {
    //Filter the Code list picker based on the selection(s) of the Code Group List picker
    let selection = listPickerProxy.getValue();
    let page = listPickerProxy.getPageProxy().getControl('FormCellContainer');

    let failureModeCodePicker = page.getControl('QMCodeListPicker');
    failureModeCodePicker.setValue('');

    if (selection.length > 0) {
        let specifier = failureModeCodePicker.getTargetSpecifier();

        let failureGroupReadLink = selection[0].ReturnValue;
        let failureGroupObject = SplitReadLink(failureGroupReadLink);

        let filter = decodeURIComponent(`$filter=Catalog eq '${failureGroupObject.Catalog}' and CodeGroup eq '${failureGroupObject.CodeGroup}'&$orderby=Code`);
        specifier.setQueryOptions(filter);
        failureModeCodePicker.setEditable(true);
        return failureModeCodePicker.setTargetSpecifier(specifier).then(() => {
            let binding = listPickerProxy.getPageProxy().binding;
            if (binding.QMCodeGroup && binding.QMCatalog && binding.QMCode && (failureGroupObject.CodeGroup === binding.QMCodeGroup)) {
                failureModeCodePicker.setValue(`PMCatalogCodes(Catalog='${binding.QMCatalog}',CodeGroup='${binding.QMCodeGroup}',Code='${binding.QMCode}')`);
            } else {
                failureModeCodePicker.setValue('');
                listPickerProxy.count('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', filter).then(count => {
                    failureModeCodePicker.setEditable(!!count);
                });
            }
         }, () => {
            failureModeCodePicker.setValue('');
            failureModeCodePicker.setEditable(false);
            return Promise.resolve();
        });
    } else {
        failureModeCodePicker.setValue('');
        failureModeCodePicker.setEditable(false);
        return Promise.resolve();
    }
}
