export const errorMsg = (err: unknown, defaultMsg: string) => {
    if (err && typeof err === 'object' && 'response' in err) {
        defaultMsg = (err as { response?: { message?: string } })
            .response?.message ?? 'Login failed';
    }
    return defaultMsg
}