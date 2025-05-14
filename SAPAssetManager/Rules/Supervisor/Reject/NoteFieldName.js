import SupervisorLibrary from '../SupervisorLibrary';

export default function NoteFieldName(context) {
    return SupervisorLibrary.isUserSupervisor(context).then(isSupervisor => {
        return isSupervisor ? '$(L,supervisor_note_caption)' : '$(L,note)';
    });
}
