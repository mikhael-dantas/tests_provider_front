import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from "@myContexts/AlertStackContext"
import { useUcfrListsContext, useUpdateUcfrListsContext } from "@myContexts/UcfrsContext"
import { UcfrListsContextInterfaces } from "src/lib/featuresInterfaces/UcfrListsContextInterfaces"


export default function CopyToClipboard({
    className,
    children,
    empty
}:{
    className?: string
    children?: React.ReactNode
    empty?: boolean
}) { 
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(ucfrListsFromContext))
        updateAlertStackComponentFromContext([
            ...alertStackComponentFromContext,
            {
                component: GenerateAlertComponent({status: "success", text: "Copied to clipboard"}),
            }
        ])
            
    }
    return ( 
        <button className={className || 'button'}
        onClick={copyToClipboard}>
            {empty ? null : "Copy to clipboard"}
            {children && children}
        </button>
    )
}
