
/**
* This function returns the confirmed quantity value.
In some scenerio the quantity value will be concatenation of confirmed/ordered quantity
and in some scenerios only confirmed quantity will be present in the input quantity field
*
*/
export default function GetConfirmedQuantity(quantity) {
    if (quantity.includes('/')) {
        return Number(quantity.split('/')[0]) || 0;
    } else {
        return Number(quantity) || 0;
    }
}

