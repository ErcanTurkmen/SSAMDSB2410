import WCMNoteDetailsNav from './WCMNoteDetailsNav';

export default function WCMNoteDetailsNavFromSection(context) {
    return WCMNoteDetailsNav(context, context.getPageProxy().getActionBinding().TextType);
}
