import { EditIcon } from '@chakra-ui/icons'
import { Flex, Grid, useDisclosure } from '@chakra-ui/react'
import { customTheme } from '../../theme'
import { ITag } from '../../UcfrsContext'
import TagModal from './TagModal'

function ListTagsItem({key, tag: receivedTag}: {key: string, tag: ITag}) {
    const {isOpen, onOpen, onClose} = useDisclosure()


    return (
        <Grid
        templateColumns={"6fr 1fr"}
        width={'100%'}
        margin={'0.2rem 0'}
        minHeight={'4rem'}
        alignItems={'center'}
        justifyContent={'space-between'}
        borderRadius={'.3rem'}
        padding={'0 .5rem'}
        backgroundColor={customTheme.colors[45]}
        >
            <Flex className={'tagItemInfo'} 
            direction={'column'}
            >
                <div>
                    {receivedTag.name}
                </div>
                <p>
                    {receivedTag.description}
                </p>
            </Flex>

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
                <TagModal isOpen={isOpen} onClose={onClose} tag={receivedTag}/>
            </Flex>
        </Grid>
    )
}

export default ListTagsItem