export default function GetPlantSBin(context) {
    let binding = context.binding;
    if (binding) {
        if (binding.StorageBin) {
            return binding.StorageBin;
        } else if (binding.MaterialSLocs && binding.MaterialSLocs.length) {
            return binding.MaterialSLocs[0].StorageBin;
        }
    }
    return '';
}
