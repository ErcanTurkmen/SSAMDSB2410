export default function GetIsContainerReleasedDetails(context) {
    return context.localizeText(context.binding.IsContainerReleased ? 'container_released_yes' : 'container_released_no');
}   
