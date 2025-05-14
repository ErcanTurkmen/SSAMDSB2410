import NotesViewNav from '../../../Notes/NotesViewNav';

/** @param {ISectionedTableProxy} context  */
export default function OperationNotesNav(context) {
    const pageProxy = context.getPageProxy();
    pageProxy.setActionBinding(pageProxy.binding);
    return NotesViewNav(context);
}
