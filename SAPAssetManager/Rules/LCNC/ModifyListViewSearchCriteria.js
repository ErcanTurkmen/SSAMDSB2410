import FetchMetadata from './FetchMetadata';
import FindPropertiesByAttribute from './FindPropertiesByAttribute';
import IsMetadataParsingFeatureEnabled from './IsMetadataParsingFeatureEnabled';

export default function ModifyListViewSearchCriteria(clientAPI, odataEntityType, searchByProperties = []) {
    if (IsMetadataParsingFeatureEnabled(clientAPI)) {
        let jsonString = FetchMetadata(clientAPI);

        if (jsonString && odataEntityType) {
            let extendedProperties = FindPropertiesByAttribute(jsonString, odataEntityType, {
                'sap:is_extension_field': 'true',
                'sap:searchable': 'true',
            });

            if (extendedProperties && extendedProperties.length > 0) {
                extendedProperties.forEach(metadataObject => {
                    //cast function returns the object referenced by the expression cast to the specified type
                    searchByProperties.push(`cast(${metadataObject._attributes.Name},'Edm.String')`);
                });
            }
        }
    }
}
