import { ValueResolver } from 'mdk-core/utils/ValueResolver';
import Logger from '../Log/Logger';
import ExtendedPropertiesStore from './ExtendedPropertiesStore';

export default async function ListViewDescriptionCustomRule(context) {
    let result;
    let pageClientData = getClientData(context);

    try {
        if (pageClientData.InheritedRulePath) {
            result = await ValueResolver.resolveValue(pageClientData.InheritedRulePath, context._context);
        } else if (pageClientData.InheritedDescription) {
            result = pageClientData.InheritedDescription;
        }

        if (pageClientData.ExtendedProperties) {
            pageClientData.ExtendedProperties.forEach(metadataObject => {
                let attributesObject = metadataObject._attributes;
                let propertyLabel = attributesObject['sap:custom_label'] || attributesObject['sap:label'];
                let propertyValue = context.binding[attributesObject.Name] || '-';
                if (attributesObject.Type === 'Edm.DateTime' && propertyValue !== '-') {
                    propertyValue = context.formatDatetime(propertyValue);
                }
                result = joinDescriptions(result, propertyLabel, propertyValue);
            });
        }
    } catch (error) {
        Logger.error('ListViewDescriptionCustomRule-ModifyDescriptionFailed', error);
    }

    return result;
}

function getClientData(context) {
    let currentPage = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Current');
    let currentPageClientData = currentPage.getClientData();

    let dataStore = ExtendedPropertiesStore.getInstance();
    let data = dataStore.getData();

    currentPageClientData.InheritedRulePath = data.InheritedRulePath;
    currentPageClientData.InheritedDescription = data.InheritedDescription;
    currentPageClientData.ExtendedProperties = data.ExtendedProperties;

    return currentPageClientData;
}

function joinDescriptions(descriptionFieldValue, propertyLabel, propertyValue) {
    if (descriptionFieldValue === undefined) descriptionFieldValue = '';

    const rowsCount = descriptionFieldValue.split('\n').length;

    if (rowsCount < 3) {
        if (descriptionFieldValue !== '') descriptionFieldValue += '\n'; //adds new line

        if (propertyLabel) {
            descriptionFieldValue += propertyLabel + ': ';
        }

        if (propertyValue) {
            descriptionFieldValue += propertyValue;
        }
    }

    return descriptionFieldValue;
}
