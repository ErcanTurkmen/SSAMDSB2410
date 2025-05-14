import { GetPartLabel } from './PartLabel';

export default function PartGroupLabel(context) {
    const [part, defect] = ['part_group', 'code_group'];
    return GetPartLabel(context, defect, part);
}
