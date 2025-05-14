import OperationItemToolBarCaption from './OperationItemToolBarCaption';

export default function IsVisibleSetTaggedUntagButton(context, wcmDocumentItem) {
    return OperationItemToolBarCaption(context, wcmDocumentItem || context.binding)
        .then(caption => caption !== '');
}
