import { Flex } from "@chakra-ui/react"
import React from "react"
import { IModule, useUcfrListsContext, useUpdateUcfrListsContext } from "../../UcfrsContext"
import { GenerateUUID } from "../../utils/UUIDGenerator"


export default function AddModule() {
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()


   const [moduleAddInput, setModuleAddInput] = React.useState<string>("")

   const moduleAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setModuleAddInput(e.target.value)
   }
   const moduleAddHandler = () => {
      const alreadyExists = ucfrListsFromContext.modules.find(m => m.name === moduleAddInput)
      if (alreadyExists) {
         return
      }

      const newModule: IModule = {
         id: GenerateUUID(),
         name: moduleAddInput,
         useCases: [],
         nestedUseCases: [],
         functionalRequirements: [],
      }
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules, newModule]
      })
      setModuleAddInput("")
   }

   return (
      <Flex>
         <input className={'input'} type="text" value={moduleAddInput} onChange={moduleAddInputHandler} />
         <button className={'button'} onClick={moduleAddHandler}>Add Item</button>
      </Flex>
   )
}