export default function ProductionOrderOpenComponentsFilterQuery() {
    const openComponentsQuery = "Completed ne 'X' and (RequirementQuantity eq 0 or WithdrawalQuantity eq 0 or RequirementQuantity gt WithdrawalQuantity)";
    return openComponentsQuery;
}


