
export default function PackageSubhead(context) {
    return context.localizeText(context.binding.IsContainerReleased ? 'package_released_yes' : 'package_released_no');
 }
