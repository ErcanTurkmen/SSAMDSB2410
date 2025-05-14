export default function DiscardStatusInstallQueryOptions(context, replaceBinbing) {
    const binding = replaceBinbing || context.binding;

    let equipObjectStatusReadlink = binding.Device_Nav.Equipment_Nav.ObjectStatus_Nav['@odata.readLink'];
    equipObjectStatusReadlink = equipObjectStatusReadlink.replace(/'/g, "''"); //escape the single quote inside the readlink with another single quote to please OData

    return `$filter=RequestURL eq '${equipObjectStatusReadlink}'`;
}
