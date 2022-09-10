import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { UcfrListsContextInterfaces, useUcfrListsContext, useUpdateUcfrListsContext } from '../../../UcfrsContext'

function NestedUseCaseAddPipelineModal({
    isOpen: isOpenReceived,
    onClose: onCloseReceived,
    nestedUseCaseId: nestedUseCaseIdReceived,
}: {
    isOpen: boolean
    onClose: () => void
    nestedUseCaseId: string
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


    const addPipelineHandler = (pipelineId: string) => {
        ucfrListsInterfaces.addUseCaseToNestedUseCasePipeline({
            useCaseIdToAdd: pipelineId,
            nestedUseCasePipelineId: nestedUseCaseIdReceived,
        })
        .then(() => {
            updateAlertStackComponentFromContext([
                ...alertStackComponentFromContext,
                {
                    component: GenerateAlertComponent({
                        status: "success",
                        text: "Use case added to pipeline successfully",
                    })
                }
            ])
            onCloseReceived()
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
    }
    return (
        <Modal isOpen={isOpenReceived} onClose={onCloseReceived}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>Add Pipeline</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex
                    flexDirection="column" alignItems="center" justifyContent="center"
                    >
                        {ucfrListsFromContext.modules.reduce((acc, module) => {
                            return [
                                ...acc,
                                ...module.useCases
                            ]}, []).map((scopedUseCase) => {
                                return (
                                    <Flex key={scopedUseCase.id} 
                                    width={'100%'} padding={'1rem'}
                                    backgroundColor={customTheme.colors[60]}
                                    margin={'0.5rem 0'}
                                    onClick={() => addPipelineHandler(scopedUseCase.id)}
                                    cursor={'pointer'}
                                    >
                                        {scopedUseCase.name}
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                </ModalBody>

                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default NestedUseCaseAddPipelineModal