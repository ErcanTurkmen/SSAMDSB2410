export function isISUInstall(isuArray) {
    for (const isuLink of isuArray) {
        if (isuLink.ISUProcess === 'INSTALL') {
            return true;
        }
    }
    return false;
}

export function isISUReplace(isuArray) {
    for (const isuLink of isuArray) {
        if (isuLink.ISUProcess === 'REPLACE') {
            return true;
        }
    }
    return false;
}

export function isISURemove(context, isuArray) {
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();
    for (const isuLink of isuArray) {
        if (isuLink.ISUProcess === REMOVE) {
            return true;
        }
    }
    return false;
}
