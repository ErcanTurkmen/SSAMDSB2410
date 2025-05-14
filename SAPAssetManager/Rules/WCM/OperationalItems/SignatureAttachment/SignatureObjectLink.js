import DocLib from '../../../Documents/DocumentLibrary';

export default function SignatureOnCreateFileName(context) {
    return DocLib.getObjectLink(context);
}
