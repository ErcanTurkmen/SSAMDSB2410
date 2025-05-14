import ApprovalStatusIcon from './ApprovalStatusIcon';
import ApprovalStatusText from './ApprovalStatusText';

export default function ApprovalStatusTextIconLabel(context) {
    return ApprovalStatusIcon(context).then(icon => ([{
        'Image': icon,
        'Text': ApprovalStatusText(context),
        'ImagePosition': 'Leading',
    }]));
}
