export default function PackageSubstatus(context) {
    return context.localizeText('package_items', [context.binding.FldLogsPackageItem_Nav?.length  || 0]);
}
