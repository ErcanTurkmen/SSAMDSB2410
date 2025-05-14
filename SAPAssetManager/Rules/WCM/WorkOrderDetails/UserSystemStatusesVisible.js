import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';
import libPersona from '../../Persona/PersonaLibrary';

export default async function UserSystemStatusesVisible(clientAPI, page) {
    let sections = page.Controls[0].Sections;

    if (libPersona.isWCMOperator(clientAPI)) {

        let NewSections = sections.filter(obj=> {
                return obj._Name !== 'UserSystemStatuses';
            },
        );
        page.Controls[0].Sections = NewSections;
    }

    return ModifyKeyValueSection(clientAPI, page, 'WorkOrderDetailsSection');

}
