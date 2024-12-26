import get from "../functions/methods/get"

export default function Test() {
    const url = "https://3001-cs-e30363ef-557e-4565-b481-2d435839e889.cs-us-east1-pkhd.cloudshell.dev/"
    
    async function testar() {
        const response = await get(url)
        console.log(response)
    }
    
    return (
        <>
            <h1>teste</h1>
            <button onClick={testar}>testar</button>
        </>
    )
}