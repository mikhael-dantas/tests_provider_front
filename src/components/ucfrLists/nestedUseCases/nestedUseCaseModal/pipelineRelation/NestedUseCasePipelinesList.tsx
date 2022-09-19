import { Flex } from "@chakra-ui/react"
import { useUcfrListsContext, INestedUseCase } from "@myContexts/UcfrsContext"
import NestedUseCasePipelineItem from "./NestedUseCasePipelineItem"

function NestedUseCasePipelinesList({
    nestedUseCaseId: nestedUseCaseIdReceived,
}: {
    nestedUseCaseId: string
}) {
    // contextManagement SDK
    const ucfrListsFromContext = useUcfrListsContext()

    return (
        <Flex className='pipelinesList'>
            { ucfrListsFromContext.modules.reduce((acc, module) => { return [...acc, ...module.nestedUseCases] }, [] as INestedUseCase[]).map((nestedUseCase) => {
                if (nestedUseCase.id === nestedUseCaseIdReceived) {
                    return nestedUseCase.useCasesPipelineIds.map((pipelineId) => {
                        return (
                            <NestedUseCasePipelineItem
                                key={pipelineId}
                                nestedUseCaseId={nestedUseCaseIdReceived}
                                pipelineId={pipelineId}
                            />
                        )
                    })
                }
            })}
        </Flex>
    )
}

export default NestedUseCasePipelinesList