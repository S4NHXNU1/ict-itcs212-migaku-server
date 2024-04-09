function validateData(requiredFields, reqBody) {
    for (let field in requiredFields) {
        if (!(field in reqBody)) {
            return false
        }
    }
    return true
}

module.exports = validateData