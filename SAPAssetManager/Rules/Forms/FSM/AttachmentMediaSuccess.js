
import NativeScriptObject from '../../Common/Library/NativeScriptObject';
import libEval from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';

export default function AttachmentMediaSuccess(context) {
    //initialize downloaded stream
    let result = context.getActionResult('FSMFormAttachmentResult').data;

    //We don't know which attachments are associated with which picker, so we store that information in a state variable
    //This state variable is populated when we initalizae the instance of the form
    //get state variable (array of Picker Name and ID)
    let stateVariable = libCom.getStateVariable(context, 'Attachments');
    let attachmentPickerName = libCom.getStateVariable(context, 'DownloadedAttachmentPicker');
    let id;
    let attachmentPickerIndex;
    let attachmentDownloadID = [];

    if (!libEval.evalIsEmpty(stateVariable) && !libEval.evalIsEmpty(attachmentPickerName)) {
        //Grab first ID that we are reading from the attachmentpicker
        attachmentPickerIndex = stateVariable.findIndex(element => element.includes(attachmentPickerName));
        id = stateVariable[attachmentPickerIndex].split(',')[1];
        //initialize variable to keep track of attachment IDs for this picker and store in statevariable
        let attachmentPickerIterator = attachmentPickerIndex;
        while (stateVariable[attachmentPickerIterator].split(',')[0] === attachmentPickerName) {
            attachmentDownloadID.push(stateVariable[attachmentPickerIterator].split(',')[1]);
            attachmentPickerIterator++;
        }
        //set another state variable to keep track of all attachmentID's for this picker
        let attachmentID = libCom.getStateVariable(context, 'AttachmentID');
        if (!attachmentID) {
            libCom.setStateVariable(context, 'AttachmentID', attachmentDownloadID);
        }

    }

    //set new variable for attachment description
    let attachmentDescriptions = [];

    //Save Downloaded Media
    if (!libEval.evalIsEmpty(result)) {
        context.read('/SAPAssetManager/Services/AssetManager.service', 'FSMFormAttachments', ['Description'], "$filter= Id eq '" + id + "'").then(fsmfilename => {
            let description = fsmfilename._array[0].Description;
            attachmentDescriptions.push(description);
            let tempFolder = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.knownFolders.temp();
            const documentPath = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.path.join(tempFolder.path, id, description);
            const documentFileObject = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.File.fromPath(documentPath);
            documentFileObject.writeSync(result, err => {
                context.getClientData().Error = context.localizeText('create_document_failed');
                context.executeAction('/SAPAssetManager/Actions/ErrorBannerMessage.action');
                throw new Error(err);
            });
            //remove saved element
            if (attachmentPickerIndex > -1) {
                stateVariable.splice(attachmentPickerIndex, 1);
            }
            //set new state variable for attachment description
            let stateDescription = libCom.getStateVariable(context, 'AttachmentDescriptions');
            if (stateDescription) {
                attachmentDescriptions = stateDescription.concat(attachmentDescriptions);
            }
            libCom.setStateVariable(context, 'AttachmentDescriptions', attachmentDescriptions);

            //create attachment entry if applicable
            createAttachment(context, attachmentPickerIndex);
        });
    }
}

//create attachment entry if control exists on current page
function createAttachment(context, attachmentPickerIndex) {

    //initalize constants
    let attachmentArray = [];
    let attachmentPickerNextName;
    const entitySet = 'FSMFormAttachments';
    const property = 'FSMFormAttachment';
    const service = '/SAPAssetManager/Services/AssetManager.service';
    let stateVariable = libCom.getStateVariable(context, 'Attachments');
    let stateDescription = libCom.getStateVariable(context, 'AttachmentDescriptions');
    let attachmentPickerName = libCom.getStateVariable(context, 'DownloadedAttachmentPicker');
    let attachmentID = libCom.getStateVariable(context, 'AttachmentID');

    //We don't know which attachments are associated with which picker, so we store that information in a state variable
    //Example: stateVariable[0] = attachmentPicker1,CD04B49FB2EBFDD456C0DBF0D8D8B941
    //check if next current attachment is last for this particular attachment picker
    //This is the last attachment Picker on the form. So this must be last attachment on this picker
    //Or next attachmentPicker name is different, so this must be the last attachment on this picker
    if (stateVariable.length > 0 && stateVariable[attachmentPickerIndex]) {
        attachmentPickerNextName = stateVariable[attachmentPickerIndex].split(',')[0];
    }
    if (libEval.evalIsEmpty(stateVariable[attachmentPickerIndex]) || attachmentPickerName !== attachmentPickerNextName) {
        //check if attachmentPicker exists on current page
        let attachmentPicker = context.getControls()[0].getControl(attachmentPickerName);
        if (attachmentPicker) {
            let attachmentValue = attachmentID;
            //iterate over the attachment picker's value and create attachment entrys
            for (const element of attachmentValue) {
                if (libForms.ifMediaExist(attachmentValue[attachmentValue.length - 1])) {
                    let readLink = 'FSMFormAttachments(\'' + element + '\')';
                    let tempFolder = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.knownFolders.temp();
                    const imageLocalPath = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.path.join(tempFolder.path, element, stateDescription[0]);
                    let attachmentEntry = attachmentPicker.createAttachmentEntry(imageLocalPath, entitySet, property, readLink, service);
                    if (attachmentEntry) {
                        attachmentArray.push(attachmentEntry);
                        //remove first element of description since we created attachmentEntry
                        stateDescription.shift();
                    }
                }
            }

            //Set Attachments
            if (attachmentArray.length !== 0) {
                let newAttachmentPickerValue = (typeof attachmentPicker._control.getValue()[0] === 'string') ? attachmentArray : attachmentPicker._control.getValue().concat(attachmentArray);
                attachmentPicker._control.setValue([...(newAttachmentPickerValue || [])]).then(() => {
                    libCom.removeStateVariable(context, 'DownloadedAttachmentPicker');
                    libCom.removeStateVariable(context, 'AttachmentID');
                    //re-enable visibility for other buttons if applicable
                    let pageControls = context.getPageProxy().getControls()[0]._control.controls;
                    for (let i = 0; i < pageControls.length; i++) {
                        if (pageControls[i].type === 'Control.Type.FormCell.Attachment' && pageControls[i].getValue().length >= 1) {
                            let id = pageControls[i].getValue();
                            //saved downloaded images have readLink
                            if ((libEval.evalIsEmpty(id[0].readLink) && libEval.evalIsEmpty(id[0].contentType))) {
                                pageControls[i + 1].controlProxy.setVisible(true);
                            } else {
                                pageControls[i + 1].controlProxy.setVisible(false);
                            }
                        }
                    }
                    attachmentPicker._control.redraw();
                });
            }
        }

    }
}
