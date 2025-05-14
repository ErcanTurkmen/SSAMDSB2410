export default function SerialPartsAreAllowed(context, bindingObject) {
   const binding = bindingObject || context.binding;
   return !!binding.SerialNoProfile;
}
