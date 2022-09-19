import { Flex } from "@chakra-ui/react"
import { useAlertStackComponentContext, useUpdateAlertStackComponentContext, GenerateAlertComponent } from "@myContexts/AlertStackContext"
import { UcfrListsContextInterfaces } from "@myFeaturesInterfaces/UcfrListsContextInterfaces"
import { useUcfrListsContext, useUpdateUcfrListsContext,  } from "@myContexts/UcfrsContext"
import React, { useEffect } from "react"

function UseCasePipelineItem({
    useCaseId: useCaseIdReceived,
    pipelineId: pipelineIdReceived,
}:
{
    useCaseId: string
    pipelineId: string
}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()
    const ucfrListsInterfaces = new UcfrListsContextInterfaces(
        ucfrListsFromContext,
        updateUcfrListsFromContext
    )
    const alertStackComponentFromContext = useAlertStackComponentContext()
    const updateAlertStackComponentFromContext = useUpdateAlertStackComponentContext()


    const [pipelineName, setPipelineName] = React.useState('')

    const removeUseCasesPipelineHandler = () => {
        ucfrListsInterfaces.removeUseCaseFromUseCasePipeline({
            useCaseIdToRemove: useCaseIdReceived,
            useCasePipelineId: pipelineIdReceived,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: 'success', text: 'Use case removed from use case pipeline'}),
                }
            ])
        })
        .catch((err) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({status: 'error', text: err.message}),
                }
            ])
        })
    }

    useEffect(() => {
        ucfrListsInterfaces.readUseCaseById({
            useCaseId: pipelineIdReceived,
        })
        .then((useCase) => {
            setPipelineName(useCase.name)
        })
        .catch((error) => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "error",
                        text: error.message,
                    })
                }
            ])
        })
    }, [pipelineIdReceived])


    return (
        <Flex
        >
            {pipelineName}
            <button onClick={removeUseCasesPipelineHandler}>X</button>
        </Flex>
    )
}

export default UseCasePipelineItem