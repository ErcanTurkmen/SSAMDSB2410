import libCom from '../../Common/Library/CommonLibrary';

export default function PartCreateIsVisible(context) {
    return context.binding.ItemCategory !== libCom.getAppParam(context, 'PART', 'TextItemCategory');
}
