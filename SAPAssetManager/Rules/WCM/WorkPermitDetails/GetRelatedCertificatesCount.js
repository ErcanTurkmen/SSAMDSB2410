import libCom from '../../Common/Library/CommonLibrary';

export default function GetRelatedCertificatesCount(context) {
    return libCom.getEntitySetCount(context, `${context.getPageProxy().binding['@odata.readLink']}/WCMApplicationDocuments`, '');
}
