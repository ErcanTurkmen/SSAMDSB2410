
export function DQBExpand(dqb, expandOptions) {
    const nonEmptyTerms = expandOptions.filter(term => !!term);
    if (nonEmptyTerms.length) {
        dqb.expand(nonEmptyTerms);
    }
    return dqb;
}

export function DQBFilter(dqb, filterTerms) {
    const nonEmptyTerms = filterTerms.filter(term => !!term);
    nonEmptyTerms.forEach(term => DQBAndFilterSafe(dqb, term));
    return dqb;
}


export function DQBAndFilterSafe(dqb, term) {  // safe means it is checking if the term is empty or the dqb has a filter already
    if (!term) {
        return;
    }
    if (dqb.hasFilter) {
        dqb.filter().and(term);
    } else {
        dqb.filter(term);
    }
}
