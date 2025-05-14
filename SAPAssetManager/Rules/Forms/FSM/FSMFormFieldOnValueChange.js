import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';

/**
 * Handle hiding/showing fields/chapters that are tied to FSM smartform visibility rules
 * Handle evaluating calculation fields
 * @param {*} context 
 * @returns 
 */
export default function FSMFormFieldOnValueChange(context, processAllRules=false) {

    let ruleMap = libCom.getStateVariable(context, 'FSMFormInstanceVisibilityRules');
    let calculationMap = libCom.getStateVariable(context, 'FSMFormInstanceCalculationRules');
    let fieldValues = libCom.getStateVariable(context, 'FSMFormInstanceControls');
    let elementsInRules = libCom.getStateVariable(context, 'FSMFormInstanceControlsInVisibilityRules');
    let elementsInCalculations = libCom.getStateVariable(context, 'FSMFormInstanceControlsInCalculations');
    let chapterArray = libCom.getStateVariable(context, 'FSMFormInstanceChapters');
    let currentChapterIndex = libCom.getStateVariable(context, 'FSMFormInstanceCurrentChapterIndex') || 0;
    let changedControlName;

    if (!processAllRules) {
        changedControlName = context.getName();
    }
    const pattern = new RegExp('\\b(' + changedControlName + ')\\b', 'i');

    libForms.evaluateCalculations(context, processAllRules, pattern, calculationMap, fieldValues, elementsInCalculations, currentChapterIndex);
    libForms.evaluateVisibilityRules(context, processAllRules, pattern, ruleMap, fieldValues, elementsInRules, chapterArray);

}
