import RefObjectLinks from './SRRefObjectLinks';

export default function RefObjectDeleteLinks(context) {
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.delete;
}
