import libCommon from '../Library/CommonLibrary';
export default function ChangeStatusIconRule(clientAPI) {
    const priority = libCommon.getTargetPathValue(clientAPI, '#Property:Priority');
    return libCommon.shouldDisplayPriorityIcon(clientAPI, priority);
}
