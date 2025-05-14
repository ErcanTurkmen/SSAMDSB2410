import commonLib from '../../Common/Library/CommonLibrary';

export default function ServiceOrderCreateUpdateDueBySwitchValue(context) {
    return commonLib.isDefined(context.binding.DueBy);
}
