import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useUcfrListsContext } from '../../UcfrsContext'
import ListModulesItem from './ListModulesItem'

function ListModules() {
    const ucfrListsFromContext = useUcfrListsContext()


    return (
        <Flex
        direction='column'
        width={"100%"}>
            {ucfrListsFromContext.modules.map(m => (
                <ListModulesItem key={m.id} module={m}/>
            ))}
        </Flex>
    )
}

export default ListModules