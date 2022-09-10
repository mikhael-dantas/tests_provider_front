import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { useUcfrListsContext, useUpdateUcfrListsContext, UcfrListsContextInterfaces } from '../../../UcfrsContext'

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
            useCaseId: useCaseIdReceived,
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
    }, [useCaseIdReceived])


    return (
        <Flex
        >
            {pipelineName}
            <button onClick={removeUseCasesPipelineHandler}>X</button>
        </Flex>
    )
}

export default UseCasePipelineItem