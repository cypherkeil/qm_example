
/**
 * Validate if a value is empty.
 * 
 * @param Object val the value to test.
 * @return errors An array of strings describing any errors found. An empty array is returned if there is no error.
 */
let isEmpty = (val) => {
    if (!val.trim()) {
        return ["cannot be blank"];
    }
    return []
}

/**
 * Validate if a value is a number.
 * 
 * @param Object val the value to test.
 * @return errors An array of strings describing any errors found. An empty array is returned if there is no error.
 */
let isNumber = (val) => {
    if (isNaN(parseFloat(val))) {
        return ["must be a number"];
    }
    return [];
}

/**
 * Validate if a value is a string.
 * 
 * @param Object val the value to test.
 * @return errors An array of strings describing any errors found. An empty array is returned if there is no error.
 */
let isString = (val) => {
    if (typeof val !== "string") {
        return ["must be a valid value"];
    }
    return [];
}

/**
 * Validate if a value is a list.
 * 
 * @param Object val the value to test.
 * @return errors An array of strings describing any errors found. An empty array is returned if there is no error.
 */
let isList = (val) => {
    let val_array = val.split(",");

    if (!val_array instanceof Array) {
        return ["must be a list"];
    }
    return [];
}

export default {
    'isEmpty': isEmpty,
    'isNumber': isNumber,
    'isString': isString,
    'isList': isList
}