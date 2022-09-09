import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { customTheme } from '../../../theme'
import ConfirmationModal from '../../ConfirmationModal'

function NestedUseCaseModal({nestedUseCaseId: nestedUseCaseIdReceived, isOpen: isOpenReceived, onClose: onCloseReceived}: {nestedUseCaseId: string, isOpen: boolean, onClose: () => void}) {

    const { isOpen: isConfirmationModalOpen, onOpen: onConfirmationModalOpen, onClose: onConfirmationModalClose } = useDisclosure()
    return (
        <Modal isOpen={isOpenReceived} onClose={onCloseReceived}>
            <ModalOverlay />
            <ModalContent backgroundColor={customTheme.colors[10]}>
                <ModalHeader>Nested Use Case View</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    oie
                </ModalBody>

                <ModalFooter>
                    {/* <Button colorScheme='green' mr={3} onClick={moduleEditNameHandler}>
                        Save
                    </Button>
                    <Button colorScheme='red' mr={3} 
                    onClick={secondOnOpen}
                    >
                        Delete Module
                    </Button> */}
                </ModalFooter>
            </ModalContent>
            <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={onConfirmationModalClose}  callback={() => {}}/>
        </Modal>
    )
}

export default NestedUseCaseModal