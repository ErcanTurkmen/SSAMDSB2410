import SetTaggedRequiredFields from './SetTaggedRequiredFields';

export default function SetTaggedRequiredFieldsDescription(context) {
    return SetTaggedRequiredFields(context).length ? context.localizeText('required_fields') : '';
}
