import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, ModalFooter } from "@chakra-ui/react"
import { IUseCase, useUcfrListsContext, useCurrentModuleContext } from "@myContexts/UcfrsContext"
import { customTheme } from "@myStyles/GlobalStyles"

function SelectUseCaseModal({
    selectedUseCaseToNestFrom,
    setSelectedUseCaseToNestFrom,
    isOpen,
    onClose,
}: {
    selectedUseCaseToNestFrom: IUseCase | null
    setSelectedUseCaseToNestFrom: React.Dispatch<React.SetStateAction<IUseCase | null>>,
    isOpen: boolean
    onClose: () => void
}) {
    const ucfrListsFromContext = useUcfrListsContext()

    const currentModuleFromContext = useCurrentModuleContext()

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>{"Select Use Case"}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex className='useCaseToNestFromList' direction={'column'}>
                        {ucfrListsFromContext.modules.find(m => m.id === currentModuleFromContext.id)?.useCases.map((scopedUseCase) => {
                            return (
                                <Flex key={scopedUseCase.id} className={'useCaseToNestFromListItem'} 
                                direction={'column'}
                                cursor={'pointer'}
                                backgroundColor={selectedUseCaseToNestFrom?.id === scopedUseCase.id ? customTheme.colors[80] : customTheme.colors[60]}
                                color='white'
                                onClick={() => { setSelectedUseCaseToNestFrom(scopedUseCase); onClose() }}
                                >
                                    {scopedUseCase.name}
                                </Flex>
                            )
                        })}
                    </Flex>
                </ModalBody>

                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SelectUseCaseModal