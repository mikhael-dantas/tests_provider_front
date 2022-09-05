import { EditIcon } from '@chakra-ui/icons'
import { Flex, useDisclosure } from '@chakra-ui/react'
import { customTheme } from '../../theme'
import { IModule, useCurrentModuleContext } from '../../UcfrsContext'
import ModuleModal from './ModuleModal'

function ListModulesItem({ key, module: receivedModule }: {key: string, module: IModule}) {
    const currentModuleFromContext = useCurrentModuleContext()

    const {isOpen, onOpen, onClose} = useDisclosure()

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