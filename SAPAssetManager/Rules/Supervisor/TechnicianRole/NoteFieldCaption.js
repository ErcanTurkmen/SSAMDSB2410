import libCom from '../../Common/Library/CommonLibrary';
import libSuper from '../SupervisorLibrary';

export default function noteFieldCaption(context) {
    if (libCom.getStateVariable(context, 'SupervisorNote') && !libSuper.isUserSupervisor(context)) {
        return '$(L,tech_note_caption)';
    }
    return '$(L,note)*';
}
