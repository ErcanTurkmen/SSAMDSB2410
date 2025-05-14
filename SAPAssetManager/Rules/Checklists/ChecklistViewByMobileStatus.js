import { ChecklistLibrary as libChecklist } from './ChecklistLibrary';

/**
 * Rule used to set value according to mobile status.
 * @see ChecklistLibrary
 */

export default function ChecklistViewByMobileStatus(context, checklist) {
    return libChecklist.getValueByMobileStatus(context, checklist);
}
