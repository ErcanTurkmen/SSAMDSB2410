import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import ObjectCardButtonTitle from './ObjectCardButtonTitle';

export default function ObjectCardTertiaryButtonTitle(context) {
    if (IsFSMS4SectionVisible(context)) {
        return ObjectCardButtonTitle(context, ['S', 'N'], true).then(titles => {
            return titles.length > 1 ? titles.find(title => title.TransitionType === 'S')?.Title : ''; 
        });
    } else {
        return ObjectCardButtonTitle(context, ['T']);
    }
}
