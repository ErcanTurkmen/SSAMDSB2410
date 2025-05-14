import libCom from '../../Common/Library/CommonLibrary';

export default function RoutesCount(sectionProxy) {
    return libCom.getEntitySetCount(sectionProxy,'MyRoutes', '');
}
