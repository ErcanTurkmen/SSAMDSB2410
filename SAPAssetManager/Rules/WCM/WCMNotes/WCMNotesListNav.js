import WCMNotesLibrary from './WCMNotesLibrary';
import WCMNoteDetailsNav from './WCMNoteDetailsNav';

export default async function WCMNotesListNav(context) {
    const pageProxy = context.getPageProxy();
    const list  = await WCMNotesLibrary.getListNoteTypesByObjectType(pageProxy);

    if (list.length === 1) {
        return WCMNoteDetailsNav(pageProxy, list[0]);
    }

    const actionBinding = {
        objectBinding: pageProxy.binding,
        sectionsBinding: [],
    };

    const sectionTemplate = {
        'SimplePropertyCell': {
            'KeyName': '/SAPAssetManager/Rules/WCM/WCMNotes/WCMNoteSectionValue.js',
            'AccessoryType': 'disclosureIndicator',
            'OnPress': '/SAPAssetManager/Rules/WCM/WCMNotes/WCMNoteDetailsNav.js',
        },
        'Layout': {
            'NumberOfColumns': 1,
        },
        '_Type': 'Section.Type.SimplePropertyCollection',
    };

    const page = pageProxy.getPageDefinition('/SAPAssetManager/Pages/WCM/WCMNotes/WCMNotesList.page');

    page.Controls[0].Sections = list.reduce((acc, textType, idx) => {
        actionBinding.sectionsBinding.push(textType);
        const newSection = JSON.parse(JSON.stringify(sectionTemplate));

        const section = Object.assign(newSection, {
            Target: `{sectionsBinding/${idx}}`, 
            _Name: `${textType}Section`, 
            Header: {
                Caption: WCMNotesLibrary.getNoteCaption(context, textType),
            },
        });
        acc.push(section);

        return acc;
    }, []);
    
    pageProxy.setActionBinding(actionBinding);
    
    return pageProxy.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/WCMNotes/WCMNotesListNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
