// black screen rendering children inside it

import { Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay } from "@chakra-ui/react"
import React from "react"

export default function FullPopup({isOpen: isOpenReceived, onClose: onCloseReceived, children}) {

   return (
      <Modal isOpen={isOpenReceived} onClose={onCloseReceived} isCentered>
         <ModalOverlay />
         <ModalContent backgroundColor={'transparent'}>
            <Flex 
            position={"relative"}
            height={"3rem"}
            >
               <ModalCloseButton color='white' backgroundColor={'grey'}/>
            </Flex>
            {children}
         </ModalContent>
      </Modal>
   )
}