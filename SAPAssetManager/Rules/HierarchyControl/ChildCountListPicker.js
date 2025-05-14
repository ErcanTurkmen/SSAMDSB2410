import libCom from '../Common/Library/CommonLibrary';

export class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.data = new Map();
    this.order = [];
  }

  get(key) {
    if (this.data.has(key)) {
      const value = this.data.get(key);
      // Move the key to the end of the order array
      this.order.splice(this.order.indexOf(key), 1);
      this.order.push(key);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.data.has(key)) {
      // Move the key to the end of the order array
      this.order.splice(this.order.indexOf(key), 1);
    } else if (this.data.size >= this.maxSize) {
      // Remove the oldest key from both the map and the order array
      const oldestKey = this.order.shift();
      this.data.delete(oldestKey);
    }
    // Add the key to the end of the order array
    this.order.push(key);
    // Set the key-value pair in the map
    this.data.set(key, value);
  }
}
// Cache size = Paging size of (Functional Location + Equipment)
const cache = new LRUCache(100);
const cachePrefix = 'ChildCountListPicker_';

export default function ChildCountListPicker(context) {
  const readLink = context.binding['@odata.readLink'];
  if (readLink.indexOf('MyFunctionalLocations') !== -1) {
    const funcLocId = context.binding.FuncLocIdIntern;
    return getCachedResult(context, 'MyFunctionalLocations', funcLocId);
  } else if (readLink.indexOf('MyEquipments') !== -1) {
    const equipId = context.binding.EquipId;
    return getCachedResult(context, 'MyEquipments', equipId);
  }
}

async function getCachedResult(context, entitySet, id) {
  const cacheKey = cachePrefix + id;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult !== null) {
    return cachedResult;
  }
  const queryOptions = entitySet === 'MyFunctionalLocations'
    ? `$filter=SuperiorFuncLocInternId eq '${id}'`
    : `$filter=SuperiorEquip eq '${id}'`;
  const result = await libCom.getEntitySetCount(context, entitySet, queryOptions);
  cache.set(cacheKey, result);
  return result;
}

export function getLRUCache() {
  return cache;
}

export function getCachePrefix() {
  return cachePrefix;
}
