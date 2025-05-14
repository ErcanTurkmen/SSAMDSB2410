import ComLib from '../../Common/Library/CommonLibrary';

export default function DocumentOnCreateGetStateVars(context) {
    let properties = {
        DocDescription: 'DocDescription',
        Doc: 'Doc',
        ObjectLink: 'ObjectLink',
        Class: 'Class',
        ObjectKey: 'ObjectKey',
        entitySet: 'entitySet',
        parentProperty: 'parentProperty',
        parentEntitySet: 'parentEntitySet',
        attachmentCount: 'attachmentCount',
    };

    if (ComLib.getStateVariable(context, 'DocumentCreateOperation')) {
        for (let prop in properties) {
            properties[prop] =  properties[prop] + 'Operation';
        }
    }
    if (ComLib.getStateVariable(context, 'DocumentCreateItem')) {
        for (let prop in properties) {
            properties[prop] =  properties[prop] + 'Item';
        }
    }

    return {
        DocDescription: ComLib.getStateVariable(context, properties.DocDescription),
        Doc: ComLib.getStateVariable(context, properties.Doc),
        ObjectLink: ComLib.getStateVariable(context, properties.ObjectLink),
        Class: ComLib.getStateVariable(context, properties.Class),
        ObjectKey: ComLib.getStateVariable(context, properties.ObjectKey),
        entitySet: ComLib.getStateVariable(context, properties.entitySet),
        parentProperty: ComLib.getStateVariable(context, properties.parentProperty),
        parentEntitySet: ComLib.getStateVariable(context, properties.parentEntitySet),
        attachmentCount: ComLib.getStateVariable(context, properties.attachmentCount),
    };
}
