
import libForms from './FSMSmartFormsLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import FSMFormPageNav from './FSMFormPageNav';
import FSMFormClosePage from './FSMFormClosePage';

/**
* Validate entire form, then complete and submit to backend
* @param {IClientAPI} clientAPI
*/
export default function FSMFormSubmit(context) {
    let passedValidation;
    let errorFound = false;

    return libForms.saveCurrentPageValues(context).then(() => {
        //Loop over all chapters, looking for data entry errors
        let chapters = libCom.getStateVariable(context, 'FSMFormInstanceChapters');
        let fields = libCom.getStateVariable(context, 'FSMFormInstanceControls');

        for (let i = 0; i < chapters.length; i++) {
            if (chapters[i].isVisible) { //Skip non-visible chapters
                let chapterControls = Object.keys(fields).filter(function(row) { //Get an array of all fields for the current chapter
                    return fields[row].ChapterIndex === i;
                });
                passedValidation = libForms.ValidateChapterValuesDuringSubmit(context, chapterControls);
                errorFound = handleValidation(context, passedValidation, errorFound, chapters[i], i);
            }
        }
        if (errorFound) { //Navigate to error chapter
            return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormValidationErrorToast.action').then(() => {
                return FSMFormPageNav(context);
            });
        }
        return FSMFormPageNav(context).then(() => { //Reload current page to fix MDK message bug (ICMTANGOAMF10-20650)
            return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FormConfirmSubmitMessage.action').then(function(result) {
                if (result.data === true) {
                    libCom.setStateVariable(context, 'FSMClosedFlag', true); //Set the closed flag for updating instance to backend
                    libCom.setStateVariable(context, 'FSMToastMessage', context.localizeText('forms_closed_toast'));
                    return FSMFormClosePage(context);
                }
                return Promise.resolve();
            });
        });
    });
}

/**
 * Adjust chapter state and error flag based on validation results
 * @param {*} context 
 * @param {*} passedValidation 
 * @param {*} errorFound 
 * @param {*} chapter 
 * @param {*} i 
 * @returns 
 */
function handleValidation(context, passedValidation, errorFound, chapter, i) {
    let error = errorFound;

    if (passedValidation) {
        if (chapter.state === 3) {
            if (chapter.hasBeenVisited) {
                chapter.state = 1;
            } else {
                chapter.state = 0;
            }
        }
    } else {
        if (!errorFound) {
            error = true;
            libCom.setStateVariable(context, 'FSMFormInstanceCurrentChapterIndex', i); //Return to this chapter that has errors
        }
        chapter.state = 3; //Error state
    }
    return error;
}
