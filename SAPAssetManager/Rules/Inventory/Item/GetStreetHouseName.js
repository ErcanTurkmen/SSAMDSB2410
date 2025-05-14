import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetStreetHouseName(context) {
    const binding = context.binding;

    if (binding && binding.HouseNum && binding.Street) {
        return `${binding.HouseNum}, ${binding.Street}`;
    }

    return ValueIfExists(binding.Street);
}
