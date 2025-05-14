import PriorityAssessment from './CreateUpdate/PriorityAssessment';

export default async function PriorityAssessmentClearAll(context) {
    let fdcControl = context.getPageProxy().getControls()[0]._control;
    let sections = fdcControl.sections;
    for (let i = 1; i < sections.length - 1; i ++) {
        // Get first picker (Consequence)
        let consequencePicker = sections[i].controls[1];

        // Get second picker (Likelihood)
        let likelihoodPicker = sections[i].controls[2];

        await consequencePicker.setValue('');
        await likelihoodPicker.setValue('');
    }
    PriorityAssessment(context);
}
