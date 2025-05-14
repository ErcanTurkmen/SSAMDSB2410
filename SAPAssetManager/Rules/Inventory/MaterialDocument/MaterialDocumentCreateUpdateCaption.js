export default function MaterialDocumentCreateUpdateCaption(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

    if (type === 'MaterialDocItem' && context.binding.AssociatedMaterialDoc) { //Updating an existing document
        return '$(L,edit)';
    }

    if (context.binding.GMCode === '05') {
        return '$(L, receive_all_document)';
    }

    if (context.binding.GMCode === '03') {
        return '$(L, receive_all_issues)';
    }

    if (type === 'MaterialDocument') {
        return '$(L,material_document_edit_title)'; //edit document    
    }

    return '$(L,material_document_create_title)'; //Creating a new document
}
