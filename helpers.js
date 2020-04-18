export const helpers = {
    findValueInArrayOfObjs: (arr, val, key, debug = false) => {
        if (debug === true) console.log(arr, val, key)
        return arr.find(o => o[key] === val);
    }
}