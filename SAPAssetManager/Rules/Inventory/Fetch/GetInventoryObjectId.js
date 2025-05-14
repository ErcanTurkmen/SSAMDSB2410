export default function GetInventoryObjectId(context) {
    let binding = context.getBindingObject();
    if (binding) {
        if (binding.IMObject === 'PRD' && binding.GenericObjectId) {
            return binding.GenericObjectId;
        } else if (binding.ObjectId) {
            return binding.ObjectId;
        }
    }
    return '';
}
