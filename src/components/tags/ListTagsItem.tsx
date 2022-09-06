import { EditIcon } from '@chakra-ui/icons'
import { Flex, Grid, useDisclosure } from '@chakra-ui/react'
import { customTheme } from '../../theme'
import { ITag } from '../../UcfrsContext'
import { ModalListItemStyle } from '../GlobalStyles'
import TagModal from './TagModal'

function ListTagsItem({tag: receivedTag}: {key: string, tag: ITag}) {
    const {isOpen, onOpen, onClose} = useDisclosure()


    return (
        <Flex
        alignItems={'center'}
        justifyContent={'space-between'}
        style={ModalListItemStyle}
        >
            <Flex className={'tagItemInfo'} 
            direction={'column'}
            >
                <div>
                    {receivedTag.name}
                </div>
            </Flex>

            <Flex>
                <EditIcon 
                height='2rem'
                width='2rem'
                padding={'0.3rem'}
                cursor={'pointer'}
                margin={'0 0.2rem'}
                backgroundColor={customTheme.colors[60]}
                color={customTheme.colors[10]}
                borderRadius={'.3rem'}
                onClick={onOpen}
                />
                <TagModal isOpen={isOpen} onClose={onClose} tagId={receivedTag.id}/>
            </Flex>
        </Flex>
    )
}

export default ListTagsItem