import S4ErrorsLibrary from '../../S4Errors/S4ErrorsLibrary';

export default function ServiceOrderTags(context) {
    if (S4ErrorsLibrary.isS4ObjectHasErrorsInBinding(context)) {
        return [
            {
                'Color': 'Red',
                'Text': '$(L,errors)',
                'Style': 'ErrorTag',
            },
        ];
    }

    return '';
}
