import FunctionalLocationCount from './FunctionalLocationCount';

export default function FunctionalLocationListFooterVisible(context) {
    return FunctionalLocationCount(context).then((count) => {
        return count > 2;
    });
}
