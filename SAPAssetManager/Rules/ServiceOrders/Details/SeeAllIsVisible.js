
export default async function SeeAllIsVisible(context) {
    return context.evaluateTargetPath('#Count') > 2;
}
