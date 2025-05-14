import { IsPrevNextButtonEnabled } from '../libWCMDocumentItem';

export default function IsPrevButtonEnabled(context) {
    return IsPrevNextButtonEnabled(context, false);
}
