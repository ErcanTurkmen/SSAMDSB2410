import IsUOMEditable from '../../IsUOMEditable';
export default function IsUoMReadOnly(context, bindingObject = undefined) {
    const binding = bindingObject || context.binding;
    return !IsUOMEditable(context, binding);
}
