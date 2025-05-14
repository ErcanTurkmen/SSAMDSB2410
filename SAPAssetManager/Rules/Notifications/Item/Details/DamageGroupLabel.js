import { GetDamageLabel } from './DamageLabel';

export default function DamageGroupLabel(context) {
    const [damage, defect] = ['damage_group', 'defect'];
    return GetDamageLabel(context, defect, damage);
}
