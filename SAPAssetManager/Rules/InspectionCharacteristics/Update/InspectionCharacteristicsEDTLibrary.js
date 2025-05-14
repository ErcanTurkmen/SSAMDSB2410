
export default class {

    /*
    * filters sections
    */
    static findHeaderSection(context, extension) {
        let sections = context.getPageProxy().getControls()[0].getSections();
        for (let index = 0; index < sections.length; index++) {
            if (sections[index]._context.element.definition._data.Class === 'EditableDataTableViewExtension' && sections[index].getExtension()) {
                if (sections[index].getExtension() === extension) {
                    return sections[index -1].getExtension();
                }
            }
        }
        return '';
    }

}   
