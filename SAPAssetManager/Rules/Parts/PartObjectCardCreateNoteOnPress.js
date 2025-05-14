import NoteCreateNav from '../Notes/NoteCreateNav';

export default function PartObjectCardCreateNoteOnPress(context) {
    const pageProxy = context.getPageProxy();
    return NoteCreateNav(pageProxy, pageProxy.getActionBinding());    
}
