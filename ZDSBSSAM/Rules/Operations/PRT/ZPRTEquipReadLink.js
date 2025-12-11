
export default function ZPRTEquipReadLink(context) {
    let readlink = context.getPageProxy().getControl('FormCellContainer')?.getControl('EquipmentLstPkr')?.getValue()[0]?.BindingObject['@odata.readLink'];
    if (readlink) {
        return readlink;
    }
    else {
        return '';
    }
}
