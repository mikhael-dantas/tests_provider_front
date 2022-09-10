import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { GenerateAlertComponent, useAlertStackComponentContext, useUpdateAlertStackComponentContext } from '../../../AlertStackContext'
import { customTheme } from '../../../theme'
import { useUcfrListsContext, useUpdateUcfrListsContext, UcfrListsContextInterfaces } from '../../../UcfrsContext'
import ConfirmationModal from '../../ConfirmationModal'

function UseCaseAddPipelineModal({
    isOpen: isOpenReceived,
    onClose: onCloseReceived,
    useCaseId: useCaseIdReceived,
}: {
    isOpen: boolean
    onClose: () => void
    useCaseId: string
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
        ucfrListsInterfaces.addUseCaseToUseCasePipeline({
            useCaseIdToAdd: useCaseIdReceived,
            useCasePipelineId: pipelineId,
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

export default UseCaseAddPipelineModal