namespace App{
    
export interface Verifiable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(validateInput: Verifiable) {
    let isValid = true
    const { value, max, maxLength, min, minLength, required } = validateInput
    if (required) {
        isValid = isValid && value.toString().trim().length !== 0
    }
    if (minLength != null && typeof value === "string") {
        isValid = isValid && value.length >= minLength
    }
    if (maxLength != null && typeof value === "string") {
        isValid = isValid && value.length <= maxLength
    }
    console.log("value type :" + typeof value);

    if (min != null && typeof value === "number") {
        isValid = isValid && +value >= min
    }
    if (max != null && typeof value === "number") {
        isValid = isValid && +value <= max
    }
    return isValid
}

}