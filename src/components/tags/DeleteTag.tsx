import { Flex, Grid } from "@chakra-ui/react"
import React from "react"
import { useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../UcfrsContext"

export default function DeleteTagComponent() {
   const currentModuleFromContext = useCurrentModuleContext()

   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()


   const [tagDeleteNameSelect, setTagDeleteNameSelect] = React.useState<string>("")


   const TagDeleteNameSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedTag = ucfrListsFromContext
      .tags.find(m => m.id === e.target.value)
      if (!selectedTag) {
         return
      }
      setTagDeleteNameSelect(selectedTag.name)
   }
   const TagDeleteNameHandler = () => {
      const TagToDelete = ucfrListsFromContext.tags.find(m => m.name === tagDeleteNameSelect)
      if (!TagToDelete) {
         return
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         tags: ucfrListsFromContext.tags.filter(m => m.id !== TagToDelete.id)
      })
   }


   return (
      <Flex direction={'column'}>
         <Flex>
            <select onChange={TagDeleteNameSelectHandler}>
               <option value={''}>Select a Tag to delete</option>
               {ucfrListsFromContext.tags.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
               ))}
            </select>
         </Flex>
         <Flex>
            <button onClick={TagDeleteNameHandler}>Delete</button>
         </Flex>
      </Flex>
   )
   
}