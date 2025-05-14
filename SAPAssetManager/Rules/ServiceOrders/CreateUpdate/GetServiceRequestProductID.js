export default function GetServiceRequestProductID(context) {
    return context.binding && context.binding.RefObj_Nav.length && context.binding.RefObj_Nav[0].ProductID;
}
