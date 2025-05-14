export default function MetersCreateUpdateConnectionDisplay(context) {
    let address = context.binding.FuncLocation_Nav.Address;
    if (address) {
        return `${address.HouseNum} ${address.Street}, ${address.City}, ${address.PostalCode}`;
    } else {
        return `${context.binding.ConnectionObject} - ${context.binding.FuncLocation_Nav.FuncLocDesc}`;
    }
}
