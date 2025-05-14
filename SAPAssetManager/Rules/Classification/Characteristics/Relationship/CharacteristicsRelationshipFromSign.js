import dataType from './CharacteristicDateOrTimeOrValue';
import relationship from './CharacteristicRelationDescription';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function CharacteristicsRelationshipFromSign(context) {
    if (libVal.evalIsEmpty(context.binding.ValueRel)) {
        return dataType(context);
    } else {
        if (context.binding.ValueRel === '1') {
            return dataType(context);
        } else {
            return relationship(context, context.binding.CharValCode_Nav.ValueCode1);
        }
    }
    
}
