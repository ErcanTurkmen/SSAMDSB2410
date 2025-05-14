import {ValueIfExists} from '../../Common/Library/Formatter';

export default function ServiceOrderProduct(context) {
    return ValueIfExists(context.binding.ProductID);
}
