
import QueryBuilder from '../Common/Query/QueryBuilder';
import FetchRequest from '../Common/Query/FetchRequest';
import ODataDate from '../Common/Date/ODataDate';
import ConfirmationDurationFromTime from './ConfirmationDurationFromTime';
import ConvertMinutesToHourString from './ConvertMinutesToHourString';
import DateBounds from './ConfirmationDateBounds';
import CommonLibrary from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

export default function ConfirmationTotalDuration(context, passedDate = undefined, doFormat=true, usePersonnelNum = '') {

    let queryBuilder = new QueryBuilder();
    let orderId;
    const mileageActivityType = CommonLibrary.getMileageActivityType(context);
    const expenseActivityType = CommonLibrary.getExpenseActivityType(context);

    switch (CommonLibrary.getPageName(context)) {
        case 'ConfirmationsListViewPage':
            // Get work order directly from the context object
            orderId = context.getBindingObject().OrderId;
            queryBuilder.addFilter(`OrderID eq '${orderId}'`);
            break;
        case 'WorkOrderConfirmations':
        case 'WorkOrderConfirmationsForDate':
            // Get the work order from the page proxy context
            orderId = context.getPageProxy().getBindingObject().OrderId;
            queryBuilder.addFilter(`OrderID eq '${orderId}'`);
            break;
        case 'WorkOrderOperationsConfirmPage':
            // time is predefined in the state, so taking it from state variable
            return `${
                ConvertMinutesToHourString(calculateDuration(getOperationsStateConfirmations(context)))
            } ${context.localizeText('hours_suffix')}`;
        default:
            break;
    }

    // If we can find a date, 
    const dateObj = passedDate === undefined ? getAssociatedDate(context) : { date: passedDate };
    // checking if at least one value exists - either a single date or a date range ('dates' key)
    if ([dateObj?.date, dateObj?.dates].filter(item => !!item)) {
        let bounds;

        if (dateObj.date) {
            let dt;

            if (dateObj.date instanceof ODataDate) {
                dt = dateObj.date.date();
            } else {
                dt = dateObj.date;
            }

            /**
             * PostingDate contains the local Date.  Converting to the DB Date applies the offset and creates 
             * the lowerbound for our query.  Upperbound is created by adding 1 day (24 hours) to the lower bound.  
             * This will return the correct confirmations for the local time zone
             */
            const [lowerb, upperb] = DateBounds(dt);
            bounds = { lowerBound: lowerb, upperBound: upperb };
        } else if (Object.keys(dateObj?.dates || {}).length) {
            // taking bounds from date range if they exist
            bounds = [dateObj.dates?.lowerBound, dateObj.dates?.upperBound];
        }

        if (bounds) {
            const { lowerBound, upperBound } = bounds;

            const filter = "StartTimeStamp ge datetime'" + lowerBound + "' and StartTimeStamp le datetime'" + upperBound + "'"; 

            queryBuilder.addFilter(filter);
        }
    }

    if (usePersonnelNum.length) {
        queryBuilder.addFilter(`PersonnelNumber eq '${usePersonnelNum}'`);
    }

    if (mileageActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${mileageActivityType}'`);
    }

    if (expenseActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${expenseActivityType}'`);
    }

    if (PersonaLibrary.isFieldServiceTechnician(context)) { //Only take the FST confirmations into account
        return WorkOrdersFSMQueryOption(context).then(orderTypes => {
            if (!ValidationLibrary.evalIsEmpty(orderTypes)) {
                queryBuilder.addFilter(orderTypes);
            }

            return executeFetchRequest(context, queryBuilder, doFormat);
        });
    } else {
        return executeFetchRequest(context, queryBuilder, doFormat);
    }   
}

function getOperationsStateConfirmations(context) {
    const operations = CommonLibrary.getStateVariable(context, 'OperationsToConfirm');
    const currentOperation = operations.find(operation => operation.OperationReadlink === context.binding['@odata.readLink']);
    if (currentOperation) {
        return [currentOperation];
    }
    return [];
}

function executeFetchRequest(context, queryBuilder, doFormat) {
    let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

    return fetchRequest.execute(context).then(result => {
        return formattedDuration(result, doFormat);
    });
}

function formattedDuration(confirmations, doFormat) {
    let totalDuration = calculateDuration(confirmations);
    if (doFormat) {
        return ConvertMinutesToHourString(totalDuration);
    }
    return `${totalDuration}`;
}

function calculateDuration(confirmations) {
    let totalDuration = 0.0;
    if (confirmations !== undefined) {
        confirmations.forEach(conf => {
            totalDuration += ConfirmationDurationFromTime(conf);
        });
    }
    return totalDuration;
}


function getAssociatedDate(context) {
    // Get the page name so we know where to look for the date/date range
    let date, dates;
    switch (CommonLibrary.getPageName(context)) {
        case 'ConfirmationsOverviewListView':
            // These pages should have PostingDate directly in the bindingObject
            date = context.getBindingObject().PostingDate;
            break;
        case 'ConfirmationsListViewPage':
            // Overview entity will be in the page binding
            date = context.getPageProxy().getBindingObject().PostingDate;
            break;
        case 'WorkOrderConfirmations':
            date = context.evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
            break;
        case 'WorkOrderConfirmationsForDate':
            date = context.getPageProxy().evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
            break;
        case 'FieldServiceOverviewClassic': 
        case 'FieldServiceOverview': 
            // FSM overview now supports date range instead of regular date, so putting range in a different object
            dates = libWO.getActualDates(context);
            break;
        default:
            break;
    }
    return { date, dates };
}
