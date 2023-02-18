import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { customTheme } from "@myStyles/GlobalStyles"
import { ManageComponentUcfrActions } from "../../../../lib/componentActions"

export default function AddPipelineModal({
    isOpen: isOpenReceived,
    onClose: onCloseReceived,
    itemId: itemIdReceived,
    itemType: itemTypeReceived,
}: {
    isOpen: boolean
    onClose: () => void
    itemId: string
    itemType: 'useCase' | 'nestedUseCase'
}) {
    const ActionsManager = new ManageComponentUcfrActions()


    const addPipelineHandler = (pipelineId: string) => {
        ActionsManager.addUseCaseToPipelineHandler({
            itemId: itemIdReceived,
            pipelineId: pipelineId,
            itemType: itemTypeReceived,
        }).then(() => {
            onCloseReceived()
        })
    }

    if (!isOpenReceived) return null
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
                        {ActionsManager.ucfrListsFromContext.modules.reduce((acc, module) => {
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
