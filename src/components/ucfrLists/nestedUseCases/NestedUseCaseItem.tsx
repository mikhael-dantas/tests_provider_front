import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { INestedUseCase, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import FullPopup from "../../FullPopup";

// interface INestedUseCase {
//    id: string
//    moduleId: string
//    tagIds: string[]
//    name: string
//    completed: boolean
//    neededFrsToWorkIds: string[]
//    parentUseCaseId: string
// }


export default function NestedUseCaseItem(
   {nestedUseCaseReceived}:
   {nestedUseCaseReceived: INestedUseCase}
) {
   const ucfrListsFromContext = useUcfrListsContext();
   const updateUcfrListsFromContext = useUpdateUcfrListsContext();

   const currentModuleFromContext = useCurrentModuleContext()

   const [completed, setCompleted] = React.useState(nestedUseCaseReceived.completed);
   const [editNameDisplay, setEditNameDisplay] = React.useState(false);
   const [useCaseNewNameInput, setUseCaseNewNameInput] = React.useState(nestedUseCaseReceived.name);

   const handleChangeUseCaseNewNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUseCaseNewNameInput(e.target.value);
   }

   const editUseCaseNameHandler = () => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  nestedUseCases: [...module.nestedUseCases.map(nestedUseCase => {
                     if (nestedUseCase.id === nestedUseCaseReceived.id) {
                        return {
                           ...nestedUseCase,
                           name: useCaseNewNameInput
                        }
                     } else {
                        return nestedUseCase
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
      setEditNameDisplay(false);
   }
   const deleteNestedUseCaseHandler = () => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  nestedUseCases: [...module.nestedUseCases.filter(nestedUseCase => nestedUseCase.id !== nestedUseCaseReceived.id)]
               }
            } else {
               return module
            }
         })]
      })
   }
   const toggleCompletedHandler = () => {
      setCompleted(!completed);
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  nestedUseCases: [...module.nestedUseCases.map(nestedUseCase => {
                     if (nestedUseCase.id === nestedUseCaseReceived.id) {
                        return {
                           ...nestedUseCase,
                           completed: !nestedUseCaseReceived.completed
                        }
                     } else {
                        return nestedUseCase
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }

   const addTagIdsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const tagId = e.target.value;

      const alreadyAdded = nestedUseCaseReceived.tagIds.includes(tagId);

      if (alreadyAdded) {
         return 
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  nestedUseCases: [...module.nestedUseCases.map(nestedUseCase => {
                     if (nestedUseCase.id === nestedUseCaseReceived.id) {
                        return {
                           ...nestedUseCase,
                           tagIds: [...nestedUseCase.tagIds, tagId]
                        }
                     } else {
                        return nestedUseCase
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }

   const removeTagIdsHandler = (tagIdReceived: string) => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  nestedUseCases: [...module.nestedUseCases.map(nestedUseCase => {
                     if (nestedUseCase.id === nestedUseCaseReceived.id) {
                        return {
                           ...nestedUseCase,
                           tagIds: [...nestedUseCase.tagIds.filter(tagId => tagId !== tagIdReceived)]
                        }
                     } else {
                        return nestedUseCase
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }

   const addNeededFrsToWorkIdsHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const neededFrsToWorkId = e.target.value;

      const alreadyAdded = nestedUseCaseReceived.neededFrsToWorkIds.includes(neededFrsToWorkId);

      if (alreadyAdded) {
         return
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  nestedUseCases: [...module.nestedUseCases.map(nestedUseCase => {
                     if (nestedUseCase.id === nestedUseCaseReceived.id) {
                        return {
                           ...nestedUseCase,
                           neededFrsToWorkIds: [...nestedUseCase.neededFrsToWorkIds, neededFrsToWorkId]
                        }
                     } else {
                        return nestedUseCase
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }
   const removeNeededFrsToWorkIdsHandler = (neededFrsToWorkIdReceived: string) => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  nestedUseCases: [...module.nestedUseCases.map(nestedUseCase => {
                     if (nestedUseCase.id === nestedUseCase.id) {
                        return {
                           ...nestedUseCase,
                           neededFrsToWorkIds: [...nestedUseCase.neededFrsToWorkIds.filter(neededFrsToWorkId => neededFrsToWorkId !== neededFrsToWorkIdReceived)]
                        }
                     } else {
                        return nestedUseCase
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }

   const getFrToWorkNameById = (idReceived: string) => {
      const allFrsFromAllModules = ucfrListsFromContext.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      } , []);

      const frToWork = allFrsFromAllModules.find(fr => fr.id === idReceived);

      return frToWork ? frToWork.name : 'not found';
   }

   const getTagNameById = (idReceived: string) => {
      const name = ucfrListsFromContext.tags.find(tag => tag.id === idReceived);

      if (name) {
         return name.name;
      }
      return 'not found';
   }

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         width={"100%"}
         backgroundColor={'#f5bbf5'}
      >
         <Flex className={'nestedUseCaseItemId'}>{nestedUseCaseReceived.id}</Flex>
         <Grid className={'nestedUseCaseInfo'} templateColumns='1fr 10fr 1fr' alignItems={'center'}>
            {/* make a checkbox with completeded boolean */}
            <input type='checkbox' checked={completed} onChange={() => setCompleted(!completed)} />
            <Flex>{nestedUseCaseReceived.name}</Flex>
            <Flex direction={'column'}>
               <Flex onClick={() => {setUseCaseNewNameInput(nestedUseCaseReceived.name);setEditNameDisplay(!editNameDisplay)}}>
                  edit
               </Flex>
               <Flex onClick={deleteNestedUseCaseHandler}>delete</Flex>
            </Flex>
         </Grid>

         <Flex className={'useCaseTags'}>
            {nestedUseCaseReceived.tagIds.map(tagId => {
               return (
               <Flex key={`${nestedUseCaseReceived.id} ${tagId}`}className={'tagItem'}>
                  <Flex className={'tagName'} key={tagId}>{getTagNameById(tagId)}</Flex>
                  <Flex className={'removeTag'} onClick={() => removeTagIdsHandler(tagId)}>x</Flex>
               </Flex>
               )
            })}
         </Flex>
         <Flex className={'addTags'}>
            <select onChange={addTagIdsHandler}>
               <option value="">Select a tag to add</option>
               {ucfrListsFromContext.tags.map(tag => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
            </select>
         </Flex>
         <Flex className={'neededFrsToWork'}>
            {nestedUseCaseReceived.neededFrsToWorkIds.map(neededFr => {
               return (
               <Flex key={`${nestedUseCaseReceived.id} ${neededFr}`}className={'neededFrItem'}>
                  <Flex className={'neededFrName'} key={neededFr}>{getFrToWorkNameById(neededFr)}</Flex>
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

         <FullPopup key={nestedUseCaseReceived.id} display={editNameDisplay} setDisplay={setEditNameDisplay}>
            <input className={'editUseCase'} value={useCaseNewNameInput} onChange={handleChangeUseCaseNewNameInput} />
            <Flex onClick={editUseCaseNameHandler}>save</Flex>
         </FullPopup>
      </Flex>
   )
}