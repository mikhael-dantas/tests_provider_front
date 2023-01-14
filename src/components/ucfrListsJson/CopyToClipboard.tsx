import { useUcfrListsContext } from "@myContexts/UcfrsContext"


export default function CopyToClipboard({
    className,
    children,
    empty
}:{
    className?: string
    children?: React.ReactNode
    empty?: boolean
}) { 
    const ucfrListsFromContext = useUcfrListsContext()
    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(ucfrListsFromContext))
    }
    return (
        <button className={className || 'button'}
        onClick={copyToClipboard}>
            {empty ? null : "Copy to clipboard"}
            {children && children}
        </button>
    )
}
