import RefObjectLinks from './SRRefObjectLinks';

export default function RefObjectUpdateLinks(context) {
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.update;
}
