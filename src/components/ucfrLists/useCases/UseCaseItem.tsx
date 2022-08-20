import { Flex, Grid } from "@chakra-ui/react"
import React from "react"
import { IUseCase, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext"
import FullPopup from "../../FullPopup"

// export interface IUseCase {
//    id: string
//    tagIds: string[]
//    name: string
//    completed: boolean
//    neededFrsToWorkIds: string[]
//    usecasesPipelineIds: string[]
// }

export default function UseCaseItem(
{usecase}: {
   usecase: IUseCase
}) {
   const [completed, setCompleted] = React.useState(usecase.completed)

   const currentModuleFromContext = useCurrentModuleContext()

   const ucfrListsFromContext = useUcfrListsContext()
   const updateUcfrListsFromContext = useUpdateUcfrListsContext()


   const [editNameDisplay, setEditNameDisplay] = React.useState(false)

   const [useCaseNewNameInput, setUseCaseNewNameInput] = React.useState(usecase.name)

   const handleChangeUseCaseNewNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUseCaseNewNameInput(e.target.value)
   }
   const editUseCaseNameHandler = () => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.map(scopeUsecase => {
                     if (usecase.id === scopeUsecase.id) {
                        return {
                           ...scopeUsecase,
                           name: useCaseNewNameInput
                        }
                     }
                     return scopeUsecase
                  })
               }
            }
            return module
         })
      })

      setUseCaseNewNameInput(useCaseNewNameInput)
   }


   const deleteUseCaseHandler = () => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.filter(scopedUsecase => scopedUsecase.id !== usecase.id)
               }
            }
            return module
         })
      })
   }


   const addTagHandler = (e) => {
      const id = e.target.value
      if (id === "") {
         return
      }

      const alreadyAdded = usecase.tagIds.includes(id)

      if (alreadyAdded) {
         return
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.map(scopeUsecase => {
                     if (usecase.id === scopeUsecase.id) {
                        return {
                           ...scopeUsecase,
                           tagIds: [...scopeUsecase.tagIds, id]
                        }
                     }
                     return scopeUsecase
                  })
               }
            }
            return module
         })
      })
   }
   const removeTagHandler = (id: string) => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.map(scopeUsecase => {
                     if (usecase.id === scopeUsecase.id) {
                        return {
                           ...scopeUsecase,
                           tagIds: scopeUsecase.tagIds.filter(tagId => tagId !== id)
                        }
                     }
                     return scopeUsecase
                  })
               }
            }
            return module
         })
      })
   }

   const getTagNameById = (tagId: string) => {
      const tag = ucfrListsFromContext.tags.find(t => t.id === tagId)
      if (!tag) {
         return "tag not found"
      }
      return tag.name
   }


   const addUseCasePipelinesHandler = (e) => {
      const id = e.target.value
      if (id === "") {
         return
      }

      const alreadyAdded = usecase.useCasesPipelineIds.includes(id)

      if (alreadyAdded) {
         return
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.map(scopeUsecase => {
                     if (usecase.id === scopeUsecase.id) {
                        return {
                           ...scopeUsecase,
                           useCasesPipelineIds: [...scopeUsecase.useCasesPipelineIds, id]
                        }
                     }
                     return scopeUsecase
                  })
               }
            }
            return module
         })
      })
   }
   const removeUseCasePipelineHandler = (id: string) => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.map(scopeUsecase => {
                     if (usecase.id === scopeUsecase.id) {
                        return {
                           ...scopeUsecase,
                           useCasesPipelineIds: scopeUsecase.useCasesPipelineIds.filter(useCasePipelineId => useCasePipelineId !== id)
                        }
                     }
                     return scopeUsecase
                  })
               }
            }
            return module
         })
      })
   }

   const getUseCasePipelineNameById = (useCasePipelineId: string) => {
      const allUseCasesFromAllModules = ucfrListsFromContext.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      } ,[])

      const useCasePipeline = allUseCasesFromAllModules.find(uc => uc.id === useCasePipelineId)

      if (!useCasePipeline) {
         return "not found"
      }
      return useCasePipeline.name
   }


   const addNeededFrsToWorkIdsHandler = (e) => {
      const id = e.target.value
      if (id === "") {
         return
      }
      
      const alreadyAdded = usecase.neededFrsToWorkIds.includes(id)

      if (alreadyAdded) {
         return
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.map(scopeUsecase => {
                     if (usecase.id === scopeUsecase.id) {
                        return {
                           ...scopeUsecase,
                           neededFrsToWorkIds: [...scopeUsecase.neededFrsToWorkIds, id]
                        }
                     }
                     return scopeUsecase
                  })
               }
            }
            return module
         })
      })
   }

   const removeNeededFrsToWorkIdsHandler = (id: string) => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  useCases: module.useCases.map(scopeUsecase => {
                     if (usecase.id === scopeUsecase.id) {
                        return {
                           ...scopeUsecase,
                           neededFrsToWorkIds: scopeUsecase.neededFrsToWorkIds.filter(neededFrsToWorkId => neededFrsToWorkId !== id)
                        }
                     }
                     return scopeUsecase
                  })
               }
            }
            return module
         })
      })
   }

   const getNeededFrsToWorkNameById = (neededFrsToWorkId: string) => {
      const allNeededFrsToWorkFromAllModules = ucfrListsFromContext.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      } ,[])

      const neededFrsToWork = allNeededFrsToWorkFromAllModules.find(nf => nf.id === neededFrsToWorkId)

      if (!neededFrsToWork) {
         return "not found"
      }
      return neededFrsToWork.name
   }


   return (
      <Flex
      backgroundColor={'lightblue'}
      marginTop={'.5rem'}
      direction={'column'}
      >
         <Flex className={'useCaseItemId'}>{usecase.id}</Flex>
         <Grid className={'useCaseInfo'} templateColumns='1fr 10fr 1fr' alignItems={'center'}>
            {/* make a checkbox with completeded boolean */}
            <input type='checkbox' checked={completed} onChange={() => setCompleted(!completed)} />
            <Flex>{usecase.name}</Flex>
            <Flex direction={'column'}>
               <Flex onClick={() => {setUseCaseNewNameInput(usecase.name);setEditNameDisplay(!editNameDisplay)}}>
                  edit
               </Flex>
               <Flex onClick={deleteUseCaseHandler}>delete</Flex>
            </Flex>
         </Grid>

         <Flex className={'useCaseTags'}>
            {usecase.tagIds.map(tagId => {
               return (
               <Flex key={`${usecase.id} ${tagId}`}className={'tagItem'}>
                  <Flex className={'tagName'} key={tagId}>{getTagNameById(tagId)}</Flex>
                  <Flex className={'removeTag'} onClick={() => removeTagHandler(tagId)}>x</Flex>
               </Flex>
               )
            })}
         </Flex>
         <Flex className={'addTags'}>
            <select onChange={addTagHandler}>
               <option value="">Select a tag to add</option>
               {ucfrListsFromContext.tags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
            </select>
         </Flex>
         <Flex className={'useCasePipelines'}>
            {usecase.useCasesPipelineIds.map(useCasePipelineId => {
               return (
               <Flex key={usecase.id + useCasePipelineId}>
                  <Flex className={'useCasePipelineName'} key={useCasePipelineId}>{getUseCasePipelineNameById(useCasePipelineId)}</Flex>
                  <Flex className={'removeUseCasePipeline'} onClick={() => removeUseCasePipelineHandler(useCasePipelineId)}>x</Flex>
               </Flex>
               )
            } )}
         </Flex>
         <Flex className={'addUseCasePipelines'}>
            <select onChange={addUseCasePipelinesHandler}>
               <option value="">Select a use case pipeline to add</option>
               {ucfrListsFromContext.modules.reduce((acc, module) => {
                  return [...acc, ...module.useCases]
               } ,[]).map(uc => <option key={uc.id} value={uc.id}>{uc.name}</option>)}
            </select>
         </Flex>
         <Flex className={'neededFrsToWork'}>
            {usecase.neededFrsToWorkIds.map(neededFr => {
               return (
               <Flex key={`${usecase.id} ${neededFr}`}className={'neededFrItem'}>
                  <Flex className={'neededFrName'} key={neededFr}>{getNeededFrsToWorkNameById(neededFr)}</Flex>
                  <Flex className={'removeNeededFr'} onClick={() => removeNeededFrsToWorkIdsHandler(neededFr)}>x</Flex>
               </Flex>
               )
            } )}
         </Flex>
         <Flex className={'addNeededFrsToWork'}>
            <select onChange={addNeededFrsToWorkIdsHandler}>
               <option value="">Select a needed fr to work to add</option>
               {ucfrListsFromContext.modules.reduce((acc, module) => {
                  return [...acc, ...module.functionalRequirements]
               } ,[]).map(fr => <option key={fr.id} value={fr.id}>{fr.name}</option>)}
            </select>
         </Flex>

         <FullPopup key={usecase.id} display={editNameDisplay} setDisplay={setEditNameDisplay}>
            <input className={'editUseCase'} value={useCaseNewNameInput} onChange={handleChangeUseCaseNewNameInput} />
            <Flex onClick={editUseCaseNameHandler}>save</Flex>
         </FullPopup>
      </Flex>
   )
}
