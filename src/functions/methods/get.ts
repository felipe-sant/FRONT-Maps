async function get(url: string, query?: Record<string, any>): Promise<any> {
    try {
        const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
        const response = await fetch(url + queryString, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json()
        return data
    } catch {
        return undefined
    }
}

export default get