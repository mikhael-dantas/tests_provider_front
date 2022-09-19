import { useUcfrListsContext } from "@myContexts/UcfrsContext"


export default function CopyToClipboard() { 
    const ucfrListsFromContext = useUcfrListsContext()
    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(ucfrListsFromContext))
    }
    return (
        <button className='button'onClick={copyToClipboard}>Copy to clipboard</button>
    )
}
