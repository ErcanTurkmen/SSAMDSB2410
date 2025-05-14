import CommonLibrary from '../../Common/Library/CommonLibrary';
import WCMNotesLibrary from './WCMNotesLibrary';

export default async function WCMNotesCount(context) {
    const pageProxy = context.getPageProxy();
    const list = await WCMNotesLibrary.getListNoteTypesByObjectType(pageProxy);
    const filterByTypes = list.map((item) => `TextType eq '${item}'`).join(' or ');
    const filter = `$filter=(${filterByTypes}) and TextString ne ''`;

    return CommonLibrary.getEntitySetCount(pageProxy, WCMNotesLibrary.getNotesEntitySet(pageProxy), filter);
}
