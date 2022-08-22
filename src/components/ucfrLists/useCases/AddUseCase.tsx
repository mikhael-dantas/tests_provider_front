import { Grid } from "@chakra-ui/react"
import React from "react"
import { useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext"
import { GenerateUUID } from "../../../utils/UUIDGenerator"

export default function AddUseCase() {
   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()

   const currentModuleFromContext = useCurrentModuleContext()

   const [usecaseAddInput, setUsecaseAddInput] = React.useState<string>("")

   const usecaseAddInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsecaseAddInput(e.target.value)
   }

   const usecaseAddHandler = () => {
      const moduleId = currentModuleFromContext.id

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === moduleId) {
               return {
                  ...module,
                  useCases: [
                     ...module.useCases,
                     {
                        id: GenerateUUID(),
                        name: usecaseAddInput,
                        moduleId: moduleId,
                        completed: false,
                        neededFrsToWorkIds: [],
                        tagIds: [],
                        useCasesPipelineIds: [],
                     }
                  ]
               }
            }
            return module
         }),
      })

      setUsecaseAddInput("")
   }

   return (
      <Grid className={'ucfrsListContainer'} 
         templateColumns={'3fr 1fr'}
         width={'100%'}
         height={'2rem'}
      >
         <input style={{}}className={'input'} type={'text'} value={usecaseAddInput} onChange={usecaseAddInputHandler} placeholder={'Add a usecase'} />
         <button className={'button'} onClick={usecaseAddHandler}>Add</button>
      </Grid>
   )
}