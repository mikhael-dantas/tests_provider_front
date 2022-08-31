import { EditIcon } from '@chakra-ui/icons'
import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { customTheme } from '../../theme'
import { IModule, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from '../../UcfrsContext'
import ModuleModal from './ModuleModal'

function ListModulesItem({ key, module: receivedModule }: {key: string, module: IModule}) {
    const ucfrListsFromContext = useUcfrListsContext()
    const updateUcfrListsFromContext = useUpdateUcfrListsContext()

    const currentModuleFromContext = useCurrentModuleContext()

    const {isOpen, onOpen, onClose} = useDisclosure()

    const editModuleNameHandler = () => {
        


    }
    return (
        <Flex
        width={'100%'}
        height={'2.8rem'}
        margin={'0.1rem 0'}
        alignItems={'center'}
        justifyContent={'space-between'}
        borderRadius={'.3rem'}
        padding={'0 .5rem'}
        backgroundColor={
            currentModuleFromContext?.id === receivedModule.id ? 
            customTheme.colors[60] : customTheme.colors[45]}
        >
            <div>
                {receivedModule.name}
            </div>
            <Flex>
                <EditIcon 
                height='2rem'
                width='2rem'
                padding={'0.3rem'}
                cursor={'pointer'}
                margin={'0 0.2rem'}
                backgroundColor={customTheme.colors[80]}
                borderRadius={'.3rem'}
                onClick={onOpen}
                />
                <ModuleModal isOpen={isOpen} onClose={onClose} module={receivedModule}/>
            </Flex>
        </Flex>
    )
}

export default ListModulesItem