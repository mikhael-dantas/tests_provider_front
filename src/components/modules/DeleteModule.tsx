import { Flex, Grid, Select } from "@chakra-ui/react"
import React from "react"
import { useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../UcfrsContext"

export default function DeleteModuleComponent() {
   const currentModuleFromContext = useCurrentModuleContext()

   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()


   const [moduleDeleteNameSelect, setModuleDeleteNameSelect] = React.useState<string>("")


   const moduleDeleteNameSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedModule = ucfrListsFromContext
      .modules.find(m => m.id === e.target.value)
      if (!selectedModule) {
         console.log("moduleDeleteNameSelectHandler")
         return
      }
      setModuleDeleteNameSelect(selectedModule.name)
   }
   const moduleDeleteNameHandler = () => {
      const moduleToDelete = ucfrListsFromContext.modules.find(m => m.name === moduleDeleteNameSelect)
      if (!moduleToDelete) {
         return
      }

      // check if is the current
      if (currentModuleFromContext.id === moduleToDelete.id) {
         return
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.filter(m => m.id !== moduleToDelete.id)
      })
   }


   return (
      <Flex className="popupContainer">
         <Flex>
            <Select className='select'onChange={moduleDeleteNameSelectHandler}>
               <option value={''}>Select a module to delete</option>
               {ucfrListsFromContext.modules.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
               ))}
            </Select>
         </Flex>
         <Flex>
            <button onClick={moduleDeleteNameHandler}>Delete</button>
         </Flex>
      </Flex>
   )
   
}