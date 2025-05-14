
export default function WarehouseTaskTags(clientAPI) {
    const tags = [];
    if (clientAPI.binding.SourceBin) {
        tags.push(
            { 
                'Text' : clientAPI.localizeText('ewm_src_bin_x', [clientAPI.binding.SourceBin]),
            },
        );
    }
    if (clientAPI.binding.DestinationBin) {
        tags.push(
            { 
                'Text' : clientAPI.localizeText('ewm_dest_bin_x', [clientAPI.binding.DestinationBin]),
            },
        );
    }
    return tags;
}
