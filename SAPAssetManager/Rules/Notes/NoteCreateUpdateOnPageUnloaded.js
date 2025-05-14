import libCom from '../Common/Library/CommonLibrary';

export default function NoteCreateUpdateOnPageUnloaded(context) {
    if (libCom.getStateVariable(context, 'SupervisorNote')) {
        libCom.removeStateVariable(context, 'SupervisorNote');
    }
}
