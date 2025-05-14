import IsMetadataParsingFeatureEnabled from './IsMetadataParsingFeatureEnabled';
import FetchMetadata from './FetchMetadata';
import FindPropertiesByAttribute from './FindPropertiesByAttribute';
import ExtendedPropertiesStore from './ExtendedPropertiesStore';

export default function ModifyListViewTableDescriptionField(context, page, extendedEntityTypeName) {
    if (!page || !extendedEntityTypeName) return '';

    if (IsMetadataParsingFeatureEnabled(context)) {
        let jsonString = FetchMetadata(context);

        if (jsonString) {
            //Find all the properties that have been extended for this entity set
            let extendedProperties = FindPropertiesByAttribute(jsonString, extendedEntityTypeName, {
                'sap:is_extension_field': 'true',
                'sap:visible_list': 'true',
            });

            if (extendedProperties && extendedProperties.length > 0) {
                let sectionedTable = page.Controls[0];
                let tableRowDefinition = sectionedTable.Sections[0].ObjectCell;
                modifyTableRowDescriptionField(tableRowDefinition, extendedProperties);
            }
        }
    }

    return page;
}

function modifyTableRowDescriptionField(tableRowDefinition, extendedProperties) {
    let dataStore = ExtendedPropertiesStore.getInstance();
    let descriptionFieldValue = tableRowDefinition.Description;
    let modifiedDescription;

    if (descriptionFieldValue && descriptionFieldValue.endsWith('.js')) {
        dataStore.saveData('InheritedRulePath', descriptionFieldValue);
        dataStore.saveData('InheritedDescription', '');
    } else {
        dataStore.saveData('InheritedDescription', descriptionFieldValue);
        dataStore.saveData('InheritedRulePath', '');
    }

    dataStore.saveData('ExtendedProperties', extendedProperties);
    modifiedDescription = '/SAPAssetManager/Rules/LCNC/ListViewDescriptionCustomRule.js';

    tableRowDefinition.Description = modifiedDescription;
}
