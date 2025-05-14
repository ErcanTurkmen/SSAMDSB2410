import ruleEvaluator from './FSMFormFieldOnValueChange';
import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';
import NativeScriptObject from '../../Common/Library/NativeScriptObject';

export default function FSMFormOnPageLoad(context) {
    //Create attachmentEntry if applicable
    initializeAttachmentPicker(context);
    libCom.removeStateVariable(context, 'AttachmentDescriptions');

    let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let chapters = libCom.getStateVariable(context, 'FSMFormInstanceChapters');

    //Remove state variables used for visibility rule evaluation
    libCom.removeStateVariable(context, 'FSMVisibilityNeedsFocus');
    libCom.removeStateVariable(context, 'FSMVisibilityNeedsPickerRefresh');

    ruleEvaluator(context, true); //Run all visibility and calculation rules when loading a new form chapter to set initial control states
    if (chapters[currentChapterIndex].state === 3) { //Validation caught errors during submit
        libForms.ValidateCurrentPageValues(context); //Highlight error fields
    }
}

/**
 * Helper function to initialize the attachment picker if need be
 * @param {*} context
 */
function initializeAttachmentPicker(context) {
    //Initalize controls
    let sectionedTableProxy = context.getPageProxy().getControls()[0];
    let pageControls = sectionedTableProxy._control.controls;

     //Initalize constants
     const entitySet = 'FSMFormAttachments';
     const property = 'FSMFormAttachment';
     const service = '/SAPAssetManager/Services/AssetManager.service';

     //state Variable holding names of attachments
     let stateDescription = libCom.getStateVariable(context, 'AttachmentDescriptions');

     //Create attachments
    for (const control of pageControls) {
        if (control.getType() === 'Control.Type.FormCell.Attachment') {
            let attachmentData = [];
            let attachmentValue = control.getValue();
            for (const element of attachmentValue) {
                //Check to see if attachment exists locally
                if (libForms.ifMediaExist(element)) {
                    //attachment exists locally so create attachmentEntry
                    let readLink = 'FSMFormAttachments(\'' + element + '\')';
                    let tempFolder = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.knownFolders.temp();
                    const imageLocalPath = NativeScriptObject.getNativeScriptObject(context).fileSystemModule.path.join(tempFolder.path, element, stateDescription[element]);
                    let attachmentProxy = control.controlProxy;
                    let attachmentEntry = attachmentProxy.createAttachmentEntry(imageLocalPath, entitySet, property, readLink, service);
                    if (attachmentEntry) {
                        attachmentData.push(attachmentEntry);
                    }
                }
            }
            //Set Attachments
            setAttachments(attachmentData, control);
        }
    }
}

function setAttachments(attachmentData, control) {
    if (attachmentData.length !== 0) {
        control.setValue(attachmentData).then(() => {
            control.redraw();
        });
    }
}
