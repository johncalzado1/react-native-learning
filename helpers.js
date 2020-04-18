export const helpers = {
    // takes in an array of objectsm searches each object for a value assigned to a specific key
    findValueInArrayOfObjs: (arr, val, key, debug = false) => {
        if (debug === true) console.log(arr, val, key)
        return arr.find(o => o[key] === val);
    },

    // Function that simply takes in an object and iterates through all it's top level keys and sets them to undefined
    setAllKeysToUndefined: (obj) => {
        // console.log("obj", obj)
        let _newObj = {}
        const objKeys = Object.keys(obj)
        if (objKeys.length > 0) {
            objKeys.forEach(key => _newObj[key] = undefined);
        }
        // console.log("new Obj", _newObj)
        return _newObj
    }
}