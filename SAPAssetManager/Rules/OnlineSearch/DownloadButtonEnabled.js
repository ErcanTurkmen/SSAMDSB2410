import libCom from '../Common/Library/CommonLibrary';

export default function DownloadButtonEnabled(context) {
    return libCom.isDefined(libCom.getStateVariable(context, 'selectedItems'));
}
