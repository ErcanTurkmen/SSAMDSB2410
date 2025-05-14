import IsOnCreate from '../../Common/IsOnCreate';

export default function IsOrgDataEditable(context) {
    return context.binding['@sap.isLocal'] || IsOnCreate(context) ? true : false;
}
