import libCommon from '../../Common/Library/CommonLibrary';

export default function ServiceOrderCreateUpdateDueByDateIsVisible(context) {
    if (libCommon.IsOnCreate(context)) { // by default due by switch is disabled, so intially we need to hide this control
        return false;
    }

    return libCommon.isDefined(context.binding.DueBy);
}
