import ResetFlagsAndClosePage from '../../Common/ChangeSet/ResetFlagsAndClosePage';


/** @param {IPageProxy} context */
export default async function WorkOrderCreateUpdateCheckChangesCancel(context) {
    if (await hasChanges(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    } else {
        return ResetFlagsAndClosePage(context);
    }
}

function hasChanges(pageProxy) {
    const visibleControls = pageProxy
        .getControl('FormCellContainer')
        .getControls()
        .filter(c => c.visible !== false && c.getEnabled() !== false);
    const control2value = visibleControls
        .map(c => [c, c._control.definition().data.Value])
        .filter(([, definitionValue]) => !!definitionValue);
    return Promise.all(
        control2value.map(([c, defaultValue]) => c._control.valueResolver().resolveValue(defaultValue, c._context).then(resolvedValue => ([c, resolvedValue]))),
    )
        .then((/** @type {[[IControlProxy, any]]} */ resolveResults) => !resolveResults.every(([c, resolvedDefaultValue]) => areEqual(c, resolvedDefaultValue)))
        .catch(() => false);  // fallback: no changes
}

function areEqual(control, value) {
    const cType = control.getType();
    const controlValue = control.getValue();
    switch (cType) {
        case 'Control.Type.FormCell.SegmentedControl':
        case 'Control.Type.FormCell.ListPicker':
            return compareLists(controlValue.map(v => v.ReturnValue), value);
        case 'Control.Type.FormCell.Switch':
            return compareBooleanLike(controlValue, value);
        case 'Control.Type.FormCell.Attachment':
            return true;  // ignoring files when cancelling
        default:
            return controlValue === value;
    }
}

function compareLists(a, b) {
    [a, b] = [a, b].map(i => Array.isArray(i) ? i.filter(v => !!v) : [i].filter(v => !!v));
    b = new Set(b);
    return a.length === b.size && a.filter(i => b.has(i)).length === b.size;  // is equal, because ReturnValues must be unique
}

function compareBooleanLike(a, b) {
    return !!a === !!b;
}
