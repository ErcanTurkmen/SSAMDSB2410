export default function FindPropertiesByAttribute(jsonString, entity, attributes) {
    if (jsonString && entity && attributes) {
        let jsonObj = JSON.parse(jsonString);
        let entityTypeArray = jsonObj['edmx:Edmx']['edmx:DataServices'].Schema.EntityType;
        let entityObj = entityTypeArray.find(entityType => entityType._attributes.Name === entity);
        let entityProperties = entityObj ? entityObj.Property : [];
        let attributesKeys = Object.keys(attributes);
        return entityProperties.filter(entityProperty => {
            return attributesKeys.every(key => {
                return entityProperty._attributes[key] === attributes[key];
            });
        });
    } else {
        return [];
    }

}
