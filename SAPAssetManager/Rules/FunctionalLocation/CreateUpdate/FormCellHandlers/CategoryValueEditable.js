import libCommon from '../../../Common/Library/CommonLibrary';

export default function CategoryValueEditable(context) {
    if (libCommon.IsOnCreate(context)) {
        return true;
    }

    return !context.binding?.CopyFuncLocIdIntern;
}
