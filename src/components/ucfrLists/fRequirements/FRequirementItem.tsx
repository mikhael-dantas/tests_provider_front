

// interface IFunctionalRequirement {
//    id: string
//    moduleId: string
//    tagIds: string[]
//    name: string
//    done: boolean
//    frDependencies: string[]
// }

import { Flex, Grid } from "@chakra-ui/react";
import React from "react";
import { IFunctionalRequirement, useCurrentModuleContext, useUcfrListsContext, useUpdateUcfrListsContext } from "../../../UcfrsContext";
import FullPopup from "../../FullPopup";

export default function FrequirementItem(
   {FRequirementReceived}:
   {FRequirementReceived: IFunctionalRequirement}
) {
   const ucfrListsFromContext = useUcfrListsContext();
   const updateUcfrListsFromContext = useUpdateUcfrListsContext();

   const currentModuleFromContext = useCurrentModuleContext()

   const [completed, setCompleted] = React.useState(FRequirementReceived.done);
   const [editNameDisplay, setEditNameDisplay] = React.useState(false);
   const [fRequirementNewNameInput, setFRequirementNewNameInput] = React.useState(FRequirementReceived.name);

   const handleChangeFrNewNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFRequirementNewNameInput(e.target.value);
   }

   const editFRequirementNameHandler = () => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  Frequirements: [...module.functionalRequirements.map(Frequirement => {
                     if (Frequirement.id === FRequirementReceived.id) {
                        return {
                           ...Frequirement,
                           name: fRequirementNewNameInput
                        }
                     } else {
                        return Frequirement
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
   const deleteFrequirementHandler = () => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  Frequirements: [...module.functionalRequirements.filter(Frequirement => Frequirement.id !== FRequirementReceived.id)]
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
                  Frequirements: [...module.functionalRequirements.map(Frequirement => {
                     if (Frequirement.id === FRequirementReceived.id) {
                        return {
                           ...Frequirement,
                           completed: !FRequirementReceived.done
                        }
                     } else {
                        return Frequirement
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

      const alreadyAdded = FRequirementReceived.tagIds.includes(tagId);

      if (alreadyAdded) {
         return 
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  Frequirements: [...module.functionalRequirements.map(Frequirement => {
                     if (Frequirement.id === FRequirementReceived.id) {
                        return {
                           ...Frequirement,
                           tagIds: [...Frequirement.tagIds, tagId]
                        }
                     } else {
                        return Frequirement
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
                  Frequirements: [...module.functionalRequirements.map(Frequirement => {
                     if (Frequirement.id === FRequirementReceived.id) {
                        return {
                           ...Frequirement,
                           tagIds: [...Frequirement.tagIds.filter(tagId => tagId !== tagIdReceived)]
                        }
                     } else {
                        return Frequirement
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }

   const addFrDependenciesHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const neededFrsToWorkId = e.target.value;

      const alreadyAdded = FRequirementReceived.frDependencies.includes(neededFrsToWorkId);

      if (alreadyAdded) {
         return
      }

      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  Frequirements: [...module.functionalRequirements.map(Frequirement => {
                     if (Frequirement.id === FRequirementReceived.id) {
                        return {
                           ...Frequirement,
                           neededFrsToWorkIds: [...Frequirement.frDependencies, neededFrsToWorkId]
                        }
                     } else {
                        return Frequirement
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }
   const removeFrDependenciesHandler = (neededFrsToWorkIdReceived: string) => {
      updateUcfrListsFromContext({
         ...ucfrListsFromContext,
         modules: [...ucfrListsFromContext.modules.map(module => {
            if (module.id === currentModuleFromContext.id) {
               return {
                  ...module,
                  Frequirements: [...module.functionalRequirements.map(Frequirement => {
                     if (Frequirement.id === Frequirement.id) {
                        return {
                           ...Frequirement,
                           neededFrsToWorkIds: [...Frequirement.frDependencies.filter(neededFrsToWorkId => neededFrsToWorkId !== neededFrsToWorkIdReceived)]
                        }
                     } else {
                        return Frequirement
                     }
                  })]
               }
            } else {
               return module
            }
         })]
      })
   }

   const getFrNameById = (idReceived: string) => {
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
         <Flex className={'FrequirementItemId'}>{FRequirementReceived.id}</Flex>
         <Grid className={'FrequirementInfo'} templateColumns='1fr 10fr 1fr' alignItems={'center'}>
            {/* make a checkbox with completeded boolean */}
            <input type='checkbox' checked={completed} onChange={() => setCompleted(!completed)} />
            <Flex>{FRequirementReceived.name}</Flex>
            <Flex direction={'column'}>
               <Flex onClick={() => {setFRequirementNewNameInput(FRequirementReceived.name);setEditNameDisplay(!editNameDisplay)}}>
                  edit
               </Flex>
               <Flex onClick={deleteFrequirementHandler}>delete</Flex>
            </Flex>
         </Grid>

         <Flex className={'useCaseTags'}>
            {FRequirementReceived.tagIds.map(tagId => {
               return (
               <Flex key={`${FRequirementReceived.id} ${tagId}`}className={'tagItem'}>
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
         <Flex className={'frDependencies'}>
            {FRequirementReceived.frDependencies.map(neededFr => {
               return (
               <Flex key={`${FRequirementReceived.id} ${neededFr}`}className={'neededFrItem'}>
                  <Flex className={'neededFrName'} key={neededFr}>{getFrNameById(neededFr)}</Flex>
                  <Flex className={'removeNeededFr'} onClick={() => removeFrDependenciesHandler(neededFr)}>x</Flex>
               </Flex>
               )
            } )}
         </Flex>
         <Flex className={'addNeededFrsToWork'}>
            <select onChange={addFrDependenciesHandler}>
               <option value="">Select a needed fr dependencie to add</option>
               {ucfrListsFromContext.modules.reduce((acc, module) => {
                  return [...acc, ...module.functionalRequirements]
               } ,[]).map(fr => <option key={fr.id} value={fr.id}>{fr.name}</option>)}
            </select>
         </Flex>

         <FullPopup key={FRequirementReceived.id} display={editNameDisplay} setDisplay={setEditNameDisplay}>
            <input className={'editUseCase'} value={fRequirementNewNameInput} onChange={handleChangeFrNewNameInput} />
            <Flex onClick={editFRequirementNameHandler}>save</Flex>
         </FullPopup>
      </Flex>
   )
}