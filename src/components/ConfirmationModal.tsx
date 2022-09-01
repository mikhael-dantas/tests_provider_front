import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'

function ConfirmationModal({ isOpen, onClose, callback}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                Are you sure?
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={callback}>
                    Yes
                </Button>
                <Button variant='ghost' onClick={onClose}>back</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmationModal