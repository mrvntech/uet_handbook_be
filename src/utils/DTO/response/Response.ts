export default ({ statusCode, errorMessage, body }: { statusCode: number, errorMessage: any, body: any }) => {
    return {
        statusCode,
        body,
        errorMessage
    }
}