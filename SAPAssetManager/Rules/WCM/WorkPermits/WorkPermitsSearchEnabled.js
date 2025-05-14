import WorkPermitsCount from './WorkPermitsCount';

export default function WorkPermitsSearchEnabled(context) {
    return WorkPermitsCount(context).then(count => {
        return count !== 0;
    });
}
