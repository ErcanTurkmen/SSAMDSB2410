import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default class Reservation {

    constructor(clientAPI, reservation) {
        this.clientAPI = clientAPI;
        this.reservation = reservation;
        this.movementType = '';

        this.movementTypeToCategory = {
            [MovementTypes.t201]: 'K', // Cost Center
            [MovementTypes.t221]: 'P', // Project
            [MovementTypes.t261]: 'F', // Order
            [MovementTypes.t281]: 'N',  // Network
        };

        this.categoryToTypeDescId = {
            'K': 'reservation_type_cost_center',
            'P': 'reservation_type_project',
            'F': 'reservation_type_order',
            'N': 'reservation_type_network',
        };

        this.categoryToMovementTypeDescId = {
            'K': 'res_gi_cost_center',
            'P': 'res_gi_project',
            'F': 'res_gi_order',
            'N': 'res_gi_network',
        };
    }

    getReservationNumWithLeadingZeros() {
        const s = '0000000000' + this.reservation.ReservationNum;
        return s.substring(s.length - 10);
    }

    getItems() {
        const queryOptions = "$filter=ReservationNum eq '" + this.reservation.ReservationNum + "'";
        return this.clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'ReservationItems', [], queryOptions).then((result) => {
            let resultArray = [];
            result.forEach(function(item) {
                resultArray.push(item);
            });
            return resultArray;
        });
    }

    getCategory() {
        return this.getItems().then((items) => {
            if (items.length) {
                this.movementType = items[0].MovementType;
                return this.movementTypeToCategory[this.movementType];
            } else {
                return null;
            }
        });
    }

    getDocumentTypeDesc() {
        return this.getCategory().then((category) => {
            const typeDesc = this.clientAPI.localizeText(this.categoryToTypeDescId[category]);
            if (typeDesc) {
                return typeDesc;
            } else {
                return this.clientAPI.localizeText('reservation');
            }
        });
    }

    getRecipient() {
        return this.getCategory().then((category) => {
            switch (category) {
                case 'K':
                    return this.reservation.CostCenter;
                case 'P':
                    return this.reservation.WBSElement;
                case 'F':
                    return this.reservation.OrderId;
                case 'N':
                    return this.reservation.Network;
            }
            return this.reservation.ReceivingPlant;
        });
    }

    getStatus() {
        let documentStatus = this.reservation.DocumentStatus;
        if (documentStatus === 'B' || !documentStatus) { //Ignore partial for now, and use open if not set
            documentStatus = 'A';
        }
        switch (documentStatus) {
            case 'A':
                return this.clientAPI.localizeText('open');
            case 'B':
                return this.clientAPI.localizeText('outbound_document_partial');
            case 'C':
                return this.clientAPI.localizeText('outbound_document_completed');
            default:
                return this.clientAPI.localizeText('open');
        }
    }

    getItemCount() {
        return this.getItems().then((items) => {
            return items.length;
        });
    }

    getMovementType() {
        if (this.movementType !== '') {
            return Promise.resolve(this.movementType);
        } else {
            return this.getItems().then((items) => {
                if (items.length) {
                    this.movementType = items[0].MovementType;
                    return this.movementType;
                } else {
                    return '';
                }
            });
        }
    }

    getMovementTypeDesc() {
        return this.getCategory().then((category) => {
            const typeDesc = this.clientAPI.localizeText(this.categoryToMovementTypeDescId[category]);
            if (typeDesc) {
                return typeDesc;
            } else {
                return null;
            }
        });
    }

}

