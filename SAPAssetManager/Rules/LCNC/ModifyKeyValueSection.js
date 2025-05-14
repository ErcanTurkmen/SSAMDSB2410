import IsMetadataParsingFeatureEnabled from './IsMetadataParsingFeatureEnabled';
import FindPropertiesByAttribute from './FindPropertiesByAttribute';
import FetchMetadata from './FetchMetadata';

/*
   Modify the key value section by adding or hiding fields.
*/
export default async function ModifyKeyValueSection(clientAPI, page, sectionName) {
    if (IsMetadataParsingFeatureEnabled(clientAPI) && page) {
        let jsonString = FetchMetadata(clientAPI);

        if (jsonString) {
            let keyValueSection = getKeyValueSection(page, sectionName);

            let binding = clientAPI.getActionBinding() || clientAPI.binding;
            if (binding) {
                await showCustomKeyValueFieldsInSection(clientAPI, jsonString, binding, keyValueSection, page);
            }

            hideCustomKeyValueFieldsInSection(jsonString, keyValueSection, binding, page);
        }
    }

    return page;
}

/*
    Add custom fields in the key value section
    If a key value section doesn't exist, then a generic one will be created
*/
async function showCustomKeyValueFieldsInSection(clientAPI, jsonString, binding, keyValueSection, page) {
    let customKeyValues = await getVisibleCustomKeyValueFields(clientAPI, jsonString, binding);

    if (customKeyValues.length) {
        if (!keyValueSection) {
            keyValueSection = createKeyValueSection(page);
        }

        keyValueSection.KeyAndValues = keyValueSection.KeyAndValues.concat(customKeyValues);
    }
}

export function getKeyValueSection(page, sectionName) {
    let sections = page.Controls[0].Sections;
    let keyValueSection;

    if (sectionName) {
        keyValueSection = sections.find(section => section._Name === sectionName);
    }

    return keyValueSection;
}

function createKeyValueSection(page) {
    let sections = page.Controls[0].Sections;
    let keyValueSection = {
        '_Type': 'Section.Type.KeyValue',
        '_Name': 'ExtendedPropertiesKeyValueSection',
        'Header': {
            'Caption': '$(L,extended_properties)',
        },
        'KeyAndValues': [],
    };
    sections.push(keyValueSection);
    return keyValueSection;
}

function removeKeyValueSection(page, keyValueSection) {
    let sections = page.Controls[0].Sections;
    let filteredSections = sections.filter(section => section._Name !== keyValueSection._Name);
    page.Controls[0].Sections = filteredSections;
}

/*
    Find all properties that have been "extended" and visible on the detail screen in the config panel
*/
async function getVisibleCustomKeyValueFields(clientAPI, jsonString, binding) {
    let keyValues = [];

    //Find all the properties that have been extended for this entity set
    let extendedProperties = FindPropertiesByAttribute(jsonString, binding['@odata.type'].substring('#sap_mobile.'.length), {
        'sap:is_extension_field': 'true',
        'sap:visible_detail': 'true',
    });

    if (extendedProperties && extendedProperties.length > 0) {
        //re-read the current binding object in order to get all properties
        let bindingObject = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '').then(resultArray => {
            return resultArray.getItem(0);
        });

        extendedProperties.forEach(metadataObject => {
            let attributesObject = metadataObject._attributes;
            // We're adding a new property
            // Check custom label first then sap label. If both don't exist then fall back to the property name
            let label = attributesObject['sap:custom_label'] || attributesObject['sap:label'] || attributesObject.Name;

            let value = bindingObject[attributesObject.Name];

            keyValues.push({
                'KeyName': label,
                'Value': value,
                '_Name': attributesObject.Name,
            });
        });
    }

    return keyValues;
}

/*
   Hide custom fields in the key value section
   If all fields should be hidden, then remove the key value section from the page
*/
function hideCustomKeyValueFieldsInSection(jsonString, keyValueSection, binding, page) {
    if (keyValueSection) {
        let keyValues = keyValueSection.KeyAndValues;
        let keyValuesNames = keyValues.filter(keyValueObject => keyValueObject._Name).map(keyValueObject => keyValueObject._Name);

        let hiddenProperties = getHiddenCustomKeyValueProperties(jsonString, binding, keyValuesNames);
        if (hiddenProperties.length > 0) {
            let visibleKeyValues = keyValues.filter(keyValueObject => {
                return hiddenProperties.every(property => !keyValueObject._Name.includes(property));
            });

            if (visibleKeyValues.length === 0) {
                removeKeyValueSection(page, keyValueSection);
            } else {
                keyValueSection.KeyAndValues = visibleKeyValues;
            }
        }
    }
}

/*
    Find all properties that have been "extended" and hidden on the detail screen in the config panel
*/
function getHiddenCustomKeyValueProperties(jsonString, binding, keyValuesNames) {
    // parse _Name property
    // pattern: entitySetName.fieldName[index]|entitySetName.fieldName|fieldName[index]|fieldName
    // [index] can be ignored
    // '|' means 'or'
    let modifiedEntitySets = new Set();
    let modifiedFieldNames = new Set();
    keyValuesNames.forEach(name => {
        let fields = name.split('|');
        fields.forEach(field => {
            if (field.includes('.')) {
                let fieldParts = field.split('.');
                modifiedFieldNames.add(fieldParts[1].split('[')[0]); //fieldName without index
                modifiedEntitySets.add(fieldParts[0]); //entitySetName
            } else if (binding) {
                modifiedFieldNames.add(field.split('[')[0]); //fieldName without index
                modifiedEntitySets.add(binding['@odata.type'].substring('#sap_mobile.'.length));
            }
        });
    });

    let hiddenProperties = new Set();
    modifiedEntitySets.forEach(entitySetName => {
        //Find all the properties that have been hidden for this entity set
        let properties = FindPropertiesByAttribute(jsonString, entitySetName, {
            'sap:is_extension_field': 'true',
            'sap:visible_detail': 'false',
        });

        properties.forEach(property => {
            if (modifiedFieldNames.has(property._attributes.Name)) {
                hiddenProperties.add(property._attributes.Name);
            }
        });
    });

    return Array.from(hiddenProperties);
}
