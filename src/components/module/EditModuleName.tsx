import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { useUcfrListsContext, useUpdateUcfrListsContext } from "../../UcfrsContext";

export default function EditModuleName() {
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()

   const [moduleEditNameInput, setModuleEditNameInput] = React.useState<string>("")
   const [moduleEditNameSelect, setModuleEditNameSelect] = React.useState<string>("")

   const moduleEditNameSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedModule = ucfrListsFromContext
      .modules.find(m => m.id === e.target.value)
      if (!selectedModule) {
         return
      }
      setModuleEditNameSelect(selectedModule.name)
   }
   const moduleEditNameInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModuleEditNameInput(e.target.value)
   }
   const moduleEditNameHandler = () => {
      const moduleToEdit = ucfrListsFromContext.modules.find(m => m.name === moduleEditNameSelect)
      if (!moduleToEdit) {
         console.log("moduleToEdit not found")
         console.log(moduleEditNameSelect)
         console.log("moduleToEdit not found")
         return
      }

      const newModule = {
         ...moduleToEdit,
         name: moduleEditNameInput,
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(m => {
            if (m.id === newModule.id) {
               return newModule
            }
            return m
         }
         )
      })
   }
   return (
      <Grid templateColumns={'1fr 1fr'}>
         <Flex>
            <select onChange={moduleEditNameSelectHandler}>
               <option value={''}>Select a module to edit</option>
               {ucfrListsFromContext.modules.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
               ))}
            </select>
         </Flex>
         <Flex>
            <input value={moduleEditNameInput} onChange={moduleEditNameInputHandler} />
            <button onClick={moduleEditNameHandler}>Edit</button>
         </Flex>
      </Grid>
   )
}