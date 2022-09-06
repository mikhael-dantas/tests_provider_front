import { EditIcon } from '@chakra-ui/icons'
import { Flex, useDisclosure } from '@chakra-ui/react'
import { customTheme } from '../../theme'
import { IModule, useCurrentModuleContext } from '../../UcfrsContext'
import { ModalListItemStyle } from '../GlobalStyles'
import ModuleModal from './ModuleModal'

function ListModulesItem({ module: receivedModule }: { module: IModule}) {
    const currentModuleFromContext = useCurrentModuleContext()

    const {isOpen, onOpen, onClose} = useDisclosure()

    return (
        <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        style={ModalListItemStyle}
        >
            <div
            >
                {receivedModule.name}
            </div>
            <Flex>
                <EditIcon 
                height='2rem'
                width='2rem'
                padding={'0.3rem'}
                cursor={'pointer'}
                margin={'0 0.2rem'}
                backgroundColor={customTheme.colors[30]}
                borderRadius={'.3rem'}
                onClick={onOpen}
                color={'white'}
                />
                <ModuleModal isOpen={isOpen} onClose={onClose} moduleId={receivedModule.id}/>
            </Flex>
        </Flex>
    )
}

export default ListModulesItem