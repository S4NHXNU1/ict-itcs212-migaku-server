function validateData(requiredFields, reqContext) {
    if(!reqContext) return false
    for (let i = 0; i < requiredFields.length; i++){
        var field = requiredFields[i]
        if (!(reqContext[field])) {
            return false
        }
    }
    return true
}

module.exports = validateData