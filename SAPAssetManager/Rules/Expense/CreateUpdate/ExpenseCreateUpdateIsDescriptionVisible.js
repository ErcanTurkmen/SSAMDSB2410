import IsOnCreate from '../../Common/IsOnCreate';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ExpenseCreateUpdateIsDescriptionVisible(context) {
    if (IsOnCreate(context)) {
        return true;
    }

    let binding = context.binding;
    let description = binding.Description;

    return (description && description.length > 0);
}
