import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function SwitchingLocation(context) {
    return ValueIfExists(context.binding.SwitchingLoc);
}
