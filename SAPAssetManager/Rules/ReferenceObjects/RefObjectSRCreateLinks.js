import RefObjectLinks from './SRRefObjectLinks';

export default function RefObjectSRCreateLinks(context) {
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.create;
}
