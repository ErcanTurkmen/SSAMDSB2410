
export default function IsOperationChangable(context) {
    let binding = context.getBindingObject();
    return binding.Operations ? binding.Operations.length > 0 : true;
}
