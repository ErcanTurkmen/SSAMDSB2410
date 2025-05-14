import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SkipReadingEnableDisable(controlProxy) {
    const setEditableFunction = controlProxy.getValue() ? CommonLibrary.setFormcellNonEditable : CommonLibrary.setFormcellEditable;
    const section = CommonLibrary.GetParentSection(controlProxy);
    ['ReadingSim', 'ValuationCodeLstPkr', 'ShortTextNote']
        .map(n => section.getControl(n))
        .forEach(c => setEditableFunction(c));
}
