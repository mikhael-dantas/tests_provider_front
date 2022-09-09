import React from "react";
import { GenerateUUID } from "./utils/UUIDGenerator";


// Interfaces
export interface ITag {
   id: string;
   name: string;
   description: string;
}
export interface IUseCase {
   id: string
   moduleId: string
   tagIds: string[]
   name: string
   completed: boolean
   neededFrsToWorkIds: string[]
   useCasesPipelineIds: string[]
}
export interface INestedUseCase {
   id: string
   moduleId: string
   tagIds: string[]
   name: string
   completed: boolean
   neededFrsToWorkIds: string[]
   parentUseCaseId: string
   useCasesPipelineIds: string[]
}
export interface IFunctionalRequirement {
   id: string
   moduleId: string
   tagIds: string[]
   name: string
   done: boolean
   frDependencies: string[]
}
export interface IModule {
   id: string
   name: string
   useCases: IUseCase[]
   nestedUseCases: INestedUseCase[]
   functionalRequirements: IFunctionalRequirement[]
}
export interface IUcfrLists {
   tags: ITag[]
   modules: IModule[]
}


// RFN Provider
export enum EUcfrListsTypes {
   useCases = "Use Cases",
   nestedUseCases = "Nested Use Cases",
   functionalRequirements = "Functional Requirements"
}

export const UcfrListsTypes: EUcfrListsTypes[] = [
   EUcfrListsTypes.useCases,
   EUcfrListsTypes.nestedUseCases,
   EUcfrListsTypes.functionalRequirements
]

const ucfrListsContext = React.createContext<IUcfrLists>(null)
const updateUcfrListsContext = React.createContext<React.Dispatch<React.SetStateAction<IUcfrLists>>>(null)

const currentModuleContext = React.createContext<IModule>(null)
const updateCurrentModuleContext = React.createContext<React.Dispatch<React.SetStateAction<IModule>>>(null)

const selectedTabToDisplayContext = React.createContext<EUcfrListsTypes>(null)
const updateSelectedTabToDisplayContext = React.createContext<React.Dispatch<React.SetStateAction<EUcfrListsTypes>>>(null)

export function UcfrsProvider({children}) {
   const [ucfrLists, setUcfrLists] = React.useState<IUcfrLists>({
      tags: [],
      modules: [],
   })

   const [currentModule, setCurrentModule] = React.useState<IModule | undefined>(undefined)

   const [selectedTabToDisplay, updateSelectedTabToDisplay] = React.useState<EUcfrListsTypes>(UcfrListsTypes[0] ? UcfrListsTypes[0] : null)


   return (
      <ucfrListsContext.Provider value={ucfrLists}>
      <updateUcfrListsContext.Provider value={setUcfrLists}>
         <currentModuleContext.Provider value={currentModule}>
         <updateCurrentModuleContext.Provider value={setCurrentModule}>
            <selectedTabToDisplayContext.Provider value={selectedTabToDisplay}>
            <updateSelectedTabToDisplayContext.Provider value={updateSelectedTabToDisplay}>
            {children}
            </updateSelectedTabToDisplayContext.Provider>
            </selectedTabToDisplayContext.Provider>
         </updateCurrentModuleContext.Provider>
         </currentModuleContext.Provider>
      </updateUcfrListsContext.Provider>
      </ucfrListsContext.Provider>
   )
}


// Context Hooks
export function useUcfrListsContext() {
   const ucfrLists = React.useContext(ucfrListsContext)
   return ucfrLists
}
export function useUpdateUcfrListsContext() {
   const setUcfrLists = React.useContext(updateUcfrListsContext)
   return setUcfrLists
}

export function useCurrentModuleContext() {
   const currentModule = React.useContext(currentModuleContext)
   return currentModule
}
export function useUpdateCurrentModuleContext() {
   const setCurrentModule = React.useContext(updateCurrentModuleContext)
   return setCurrentModule
}

export function useSelectedTabToDisplayContext() {
   const selectedTabToDisplay = React.useContext(selectedTabToDisplayContext)
   return selectedTabToDisplay
}
export function useUpdateSelectedTabToDisplayContext() {
   const updateSelectedTabToDisplay = React.useContext(updateSelectedTabToDisplayContext)
   return updateSelectedTabToDisplay
}



// class to serve as interfaces for updating context
export class UcfrListsContextInterfaces {
   constructor(
      private ucfrLists: IUcfrLists,
      private setUcfrLists: React.Dispatch<React.SetStateAction<IUcfrLists>>,
   ) {}

   // MODULES
   async createModule({moduleName: receivedModuleName}: {moduleName: string}) {
      if (this.ucfrLists.modules.find(module => module.name === receivedModuleName)) {
         throw new Error("Module already exists")
      }
      // cannot be blank spaces
      if (receivedModuleName.trim() === "") {
         throw new Error("Module name cannot be blank")
      }
      // cannot be bigger than 20 characters
      if (receivedModuleName.length > 20) {
         throw new Error("Module name cannot be bigger than 20 characters")
      }
      // cannot be smaller than 2 characters
      if (receivedModuleName.length < 2) {
         throw new Error("Module name cannot be smaller than 2 characters")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: [...this.ucfrLists.modules, {
            id: GenerateUUID(),
            name: receivedModuleName,
            useCases: [],
            nestedUseCases: [],
            functionalRequirements: []
         }]
      })
   }
   async readModuleById({moduleId: receivedModuleId}: {moduleId: string}) {
      const {modules} = this.ucfrLists
      const foundModule = modules.find(({id: moduleId}) => moduleId === receivedModuleId)
      if (!foundModule) {
         throw new Error("Module not found")
      }
      return foundModule
   }
   async readModuleByName({moduleName: receivedModuleName}: {moduleName: string}) {
      const {modules} = this.ucfrLists
      const foundModule = modules.find(({name: moduleName}) => moduleName === receivedModuleName)
      if (!foundModule) {
         throw new Error("Module not found")
      }
      return foundModule
   }
   async updateModuleById({moduleId: receivedModuleId, newModuleName: receivedNewModuleName}: {moduleId: string, newModuleName: string}) {
      const {modules} = this.ucfrLists
      const foundModule = modules.find(({id: moduleId}) => moduleId === receivedModuleId)
      if (!foundModule) {
         throw new Error("Module not found")
      }
      if (receivedNewModuleName === "") {
         throw new Error("Module name cannot be empty")
      }
      // cannot be bigger than 20 characters
      if (receivedNewModuleName.length > 20) {
         throw new Error("Module name cannot be bigger than 20 characters")
      }
      // cannot be smaller than 2 characters
      if (receivedNewModuleName.length < 2) {
         throw new Error("Module name cannot be smaller than 2 characters")
      }

      const newModules = modules.map(module => {
         if (module.id === receivedModuleId) {
            return {
               ...module,
               name: receivedNewModuleName
            }
         }
         return module
      })

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: newModules
      })
   }
   async removeModule({moduleId: receivedModuleId}: {moduleId: string}) {
      if (!this.ucfrLists.modules.find(module => module.id === receivedModuleId)) {
         throw new Error("Module does not exist")
      }
      // cannot remove module if it has use cases, nested use cases or functional requirements
      if (this.ucfrLists.modules.find(module => module.id === receivedModuleId).useCases.length > 0) {
         throw new Error("Cannot remove module with use cases")
      }
      if (this.ucfrLists.modules.find(module => module.id === receivedModuleId).nestedUseCases.length > 0) {
         throw new Error("Cannot remove module with nested use cases")
      }
      if (this.ucfrLists.modules.find(module => module.id === receivedModuleId).functionalRequirements.length > 0) {
         throw new Error("Cannot remove module with functional requirements")
      }


      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.filter(module => module.id !== receivedModuleId)
      })
   }



   // TAGS
   async createTag({tagName: receivedTagName, tagDescription: receivedTagDescription}: {tagName: string, tagDescription: string}) {
      // cannot be blank spaces
      if (receivedTagName.trim() === "") {
         throw new Error("Tag name cannot be blank")
      }
      // cannot be bigger than 20 characters
      if (receivedTagName.length > 20) {
         throw new Error("Tag name cannot be bigger than 20 characters")
      }
      // cannot be smaller than 2 characters
      if (receivedTagName.length < 2) {
         throw new Error("Tag name cannot be smaller than 2 characters")
      }
      // cannot exist already
      if (this.ucfrLists.tags.find(tag => tag.name === receivedTagName)) {
         throw new Error("Tag already exists")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         tags: [...this.ucfrLists.tags, {
            id: GenerateUUID(),
            name: receivedTagName,
            description: receivedTagDescription ? receivedTagDescription : ""
         }]
      })
   }
   async readTagById({tagId: receivedTagId}: {tagId: string}) {
      const {tags} = this.ucfrLists
      const foundTag = tags.find(({id: tagId}) => tagId === receivedTagId)
      if (!foundTag) {
         throw new Error("Tag not found")
      }
      return foundTag
   }
   async readTagByName({tagName: receivedTagName}: {tagName: string}) {
      const {tags} = this.ucfrLists
      const foundTag = tags.find(({name: tagName}) => tagName === receivedTagName)
      if (!foundTag) {
         throw new Error("Tag not found")
      }
      return foundTag
   }
   async updateTagById({tagId: receivedTagId, newTagName: receivedNewTagName, newTagDescription: receivedNewTagDescription}: {tagId: string, newTagName: string, newTagDescription: string}) {
      const {tags} = this.ucfrLists
      const foundTag = tags.find(({id: tagId}) => tagId === receivedTagId)
      if (!foundTag) {
         throw new Error("Tag not found")
      }
      if (receivedNewTagName.trim() === "") {
         throw new Error("Tag name cannot be blank")
      }
      // cannot be bigger than 20 characters
      if (receivedNewTagName.length > 20) {
         throw new Error("Tag name cannot be bigger than 20 characters")
      }
      // cannot be smaller than 2 characters
      if (receivedNewTagName.length < 2) {
         throw new Error("Tag name cannot be smaller than 2 characters")
      }
      // cannot exist already
      if (this.ucfrLists.tags.find(tag => tag.name === receivedNewTagName)) {
         throw new Error("Tag already exists")
      }

      const newTags = tags.map(tag => {
         if (tag.id === receivedTagId) {
            return {
               ...tag,
               name: receivedNewTagName,
               description: receivedNewTagDescription ? receivedNewTagDescription : ""
            }
         }
         return tag
      })

      this.setUcfrLists({
         ...this.ucfrLists,
         tags: newTags
      })
   }
   async removeTag({tagId: receivedTagId}: {tagId: string}) {
      if (!this.ucfrLists.tags.find(tag => tag.id === receivedTagId)) {
         throw new Error("Tag does not exist")
      }
      // cannot remove tag if it is used in use cases, nested use cases or functional requirements
      const allUseCases = this.ucfrLists.modules.reduce((acc, module) => [...acc, ...module.useCases], [])
      const allNestedUseCases = this.ucfrLists.modules.reduce((acc, module) => [...acc, ...module.nestedUseCases], [])
      const allFunctionalRequirements = this.ucfrLists.modules.reduce((acc, module) => [...acc, ...module.functionalRequirements], [])
      if (allUseCases.find(useCase => useCase.tags.find(tag => tag.id === receivedTagId))) {
         throw new Error("Cannot remove tag that is used in use cases")
      }
      if (allNestedUseCases.find(nestedUseCase => nestedUseCase.tags.find(tag => tag.id === receivedTagId))) {
         throw new Error("Cannot remove tag that is used in nested use cases")
      }
      if (allFunctionalRequirements.find(functionalRequirement => functionalRequirement.tags.find(tag => tag.id === receivedTagId))) {
         throw new Error("Cannot remove tag that is used in functional requirements")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         tags: this.ucfrLists.tags.filter(tag => tag.id !== receivedTagId)
      })
   }
   // TAG ACTIONS
   async addTagToUseCaseById({useCaseId: receivedUseCaseId, tagId: receivedTagId}: {useCaseId: string, tagId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      if (useCase.tagIds.find(scopedTag => scopedTag === receivedTagId)) {
         throw new Error("Tag already added to use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCase.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.map(scopedUseCase => {
                     if (scopedUseCase.id === receivedUseCaseId) {
                        return {
                           ...scopedUseCase,
                           tagIds: [...scopedUseCase.tagIds, receivedTagId]
                        }
                     }
                     return scopedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeTagFromUseCaseById({useCaseId: receivedUseCaseId, tagId: receivedTagId}: {useCaseId: string, tagId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      if (!useCase.tagIds.find(scopedTag => scopedTag === receivedTagId)) {
         throw new Error("Tag not added to use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCase.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.map(scopedUseCase => {
                     if (scopedUseCase.id === receivedUseCaseId) {
                        return {
                           ...scopedUseCase,
                           tagIds: scopedUseCase.tagIds.filter(tagId => tagId !== receivedTagId)
                        }
                     }
                     return scopedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }

   async addTagToNestedUseCaseById({nestedUseCaseId: receivedNestedUseCaseId, tagId: receivedTagId}: {nestedUseCaseId: string, tagId: string}) {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedNestedUseCaseId) as INestedUseCase

      if (!nestedUseCase) {
         throw new Error("Nested use case not found")
      }

      if (nestedUseCase.tagIds.find(scopedTag => scopedTag === receivedTagId)) {
         throw new Error("Tag already added to nested use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCase.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.map(scopedNestedUseCase => {
                     if (scopedNestedUseCase.id === receivedNestedUseCaseId) {
                        return {
                           ...scopedNestedUseCase,
                           tagIds: [...scopedNestedUseCase.tagIds, receivedTagId]
                        }
                     }
                     return scopedNestedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeTagFromNestedUseCaseById({nestedUseCaseId: receivedNestedUseCaseId, tagId: receivedTagId}: {nestedUseCaseId: string, tagId: string}) {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedNestedUseCaseId) as INestedUseCase

      if (!nestedUseCase) {
         throw new Error("Nested use case not found")
      }

      if (!nestedUseCase.tagIds.find(scopedTag => scopedTag === receivedTagId)) {
         throw new Error("Tag not added to nested use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCase.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.map(scopedNestedUseCase => {
                     if (scopedNestedUseCase.id === receivedNestedUseCaseId) {
                        return {
                           ...scopedNestedUseCase,
                           tagIds: scopedNestedUseCase.tagIds.filter(tagId => tagId !== receivedTagId)
                        }
                     }
                     return scopedNestedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }

   async addTagToFunctionalRequirementById({functionalRequirementId: receivedFunctionalRequirementId, tagId: receivedTagId}: {functionalRequirementId: string, tagId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      if (functionalRequirement.tagIds.find(scopedTag => scopedTag === receivedTagId)) {
         throw new Error("Tag already added to functional requirement")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === functionalRequirement.moduleId) {
               return {
                  ...scopedModule,
                  functionalRequirements: scopedModule.functionalRequirements.map(scopedFunctionalRequirement => {
                     if (scopedFunctionalRequirement.id === receivedFunctionalRequirementId) {
                        return {
                           ...scopedFunctionalRequirement,
                           tagIds: [...scopedFunctionalRequirement.tagIds, receivedTagId]
                        }
                     }
                     return scopedFunctionalRequirement
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeTagFromFunctionalRequirementById({functionalRequirementId: receivedFunctionalRequirementId, tagId: receivedTagId}: {functionalRequirementId: string, tagId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      if (!functionalRequirement.tagIds.find(scopedTag => scopedTag === receivedTagId)) {
         throw new Error("Tag not added to functional requirement")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === functionalRequirement.moduleId) {
               return {
                  ...scopedModule,
                  functionalRequirements: scopedModule.functionalRequirements.map(scopedFunctionalRequirement => {
                     if (scopedFunctionalRequirement.id === receivedFunctionalRequirementId) {
                        return {
                           ...scopedFunctionalRequirement,
                           tagIds: scopedFunctionalRequirement.tagIds.filter(tagId => tagId !== receivedTagId)
                        }
                     }
                     return scopedFunctionalRequirement
                  })
               }
            }
            return scopedModule
         })
      })
   }

   async readListOfUseCaseDependentsOfTagId({tagId: receivedTagId}: {tagId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCases = allUseCasesFromAllModules.filter(useCase => useCase.tagIds.find(tagId => tagId === receivedTagId))

      return useCases
   }
   async readListOfNestedUseCaseDependentsOfTagId({tagId: receivedTagId}: {tagId: string}) {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCases = allNestedUseCasesFromAllModules.filter(nestedUseCase => nestedUseCase.tagIds.find(tagId => tagId === receivedTagId))

      return nestedUseCases
   }
   async readListOfFunctionalRequirementDependentsOfTagId({tagId: receivedTagId}: {tagId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirements = allFunctionalRequirementsFromAllModules.filter(functionalRequirement => functionalRequirement.tagIds.find(tagId => tagId === receivedTagId))

      return functionalRequirements
   }



   // USE CASES
   async createUseCase({name: receivedName, moduleId: receivedModuleId}: {name: string, moduleId: string}): Promise<IUseCase> {
      if (receivedName.trim() === "") {
         throw new Error("Use case name cannot be empty")
      }
      // cannot be smaller than 2 characters
      if (receivedName.trim().length < 2) {
         throw new Error("Use case name must be at least 2 characters long")
      }
      // cannot be larger than 250 characters
      if (receivedName.trim().length > 250) {
         throw new Error("Use case name cannot be larger than 250 characters")
      }

      const module = this.ucfrLists.modules.find(scopedModule => scopedModule.id === receivedModuleId) as IModule

      if (!module) {
         throw new Error("Module not found")
      }

      const useCase: IUseCase = {
         id: GenerateUUID(),
         name: receivedName,
         moduleId: receivedModuleId,
         completed: false,
         tagIds: [],
         neededFrsToWorkIds: [],
         useCasesPipelineIds: [],
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === receivedModuleId) {
               return {
                  ...scopedModule,
                  useCases: [...scopedModule.useCases, useCase]
               }
            }
            return scopedModule
         })
      })

      return useCase
   }
   async readUseCaseById({useCaseId: receivedUseCaseId}: {useCaseId: string}): Promise<IUseCase> {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      return useCase
   }
   async updateUseCaseById({useCaseId: receivedUseCaseId, name: receivedName, completed: receivedCompleted}: {useCaseId: string, name: string, completed: boolean}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      if (receivedName.trim() === "") {
         throw new Error("Use case name cannot be empty")
      }
      // cannot be smaller than 2 characters
      if (receivedName.trim().length < 2) {
         throw new Error("Use case name must be at least 2 characters long")
      }
      // cannot be larger than 250 characters
      if (receivedName.trim().length > 250) {
         throw new Error("Use case name cannot be larger than 250 characters")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCase.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.map(scopedUseCase => {
                     if (scopedUseCase.id === receivedUseCaseId) {
                        return {
                           ...scopedUseCase,
                           name: receivedName,
                           completed: receivedCompleted
                        }
                     }
                     return scopedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeUseCaseById({useCaseId: receivedUseCaseId}: {useCaseId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      // cannot delete use case if it is in pipeline of another use case
      const dependents = await this.readListOfUseCasePipelineDependentsByUseCaseId({useCaseId: receivedUseCaseId})
      if (dependents.length > 0) {
         throw new Error("Cannot delete use case that is in pipeline of another use case")
      }

      // cannot delete use case if it is in pipeline of another nested use case
      const nestedDependents = await this.readListOfNestedUseCasePipelineDependentsByUseCaseId({useCaseId: receivedUseCaseId})
      if (nestedDependents.length > 0) {
         throw new Error("Cannot delete use case that is in pipeline of another nested use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCase.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.filter(scopedUseCase => scopedUseCase.id !== receivedUseCaseId)
               }
            }
            return scopedModule
         })
      })
   }
   // USE CASES ACTIONS
   async addUseCaseToUseCasePipeline({useCaseIdToAdd: receivedUseCaseId, useCasePipelineId: receivedUseCasePipelineId}: {useCaseIdToAdd: string, useCasePipelineId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {throw new Error("Use case not found")}

      const useCasePipeline = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCasePipelineId) as IUseCase

      if (!useCasePipeline) {throw new Error("Use case pipeline not found")}

      if (useCasePipeline.useCasesPipelineIds.includes(receivedUseCaseId)) {
         throw new Error("Use case is already in pipeline")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCasePipeline.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.map(scopedUseCase => {
                     if (scopedUseCase.id === receivedUseCasePipelineId) {
                        return {
                           ...scopedUseCase,
                           useCasesPipelineIds: [...scopedUseCase.useCasesPipelineIds, receivedUseCaseId]
                        }
                     }
                     return scopedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeUseCaseFromUseCasePipeline({useCaseIdToRemove: receivedUseCaseId, useCasePipelineId: receivedUseCasePipelineId}: {useCaseIdToRemove: string, useCasePipelineId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {throw new Error("Use case not found")}

      const useCasePipeline = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCasePipelineId) as IUseCase

      if (!useCasePipeline) {throw new Error("Use case pipeline not found")}

      if (!useCasePipeline.useCasesPipelineIds.includes(receivedUseCaseId)) {
         throw new Error("Use case is not in pipeline")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCasePipeline.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.map(scopedUseCase => {
                     if (scopedUseCase.id === receivedUseCasePipelineId) {
                        return {
                           ...scopedUseCase,
                           useCasesPipelineIds: scopedUseCase.useCasesPipelineIds.filter(scopedUseCaseId => scopedUseCaseId !== receivedUseCaseId)
                        }
                     }
                     return scopedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }

   async addUseCaseToNestedUseCasePipeline({useCaseIdToAdd: receivedUseCaseId, nestedUseCasePipelineId: receivedNestedUseCasePipelineId}: {useCaseIdToAdd: string, nestedUseCasePipelineId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {throw new Error("Use case not found")}

      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCasePipeline = allNestedUseCasesFromAllModules.find(scopedNestedUseCase => scopedNestedUseCase.id === receivedNestedUseCasePipelineId) as INestedUseCase

      if (!nestedUseCasePipeline) {throw new Error("Nested use case pipeline not found")}

      if (nestedUseCasePipeline.useCasesPipelineIds.includes(receivedUseCaseId)) {
         throw new Error("Use case is already in pipeline")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCasePipeline.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.map(scopedNestedUseCase => {
                     if (scopedNestedUseCase.id === receivedNestedUseCasePipelineId) {
                        return {
                           ...scopedNestedUseCase,
                           useCasesPipelineIds: [...scopedNestedUseCase.useCasesPipelineIds, receivedUseCaseId]
                        }
                     }
                     return scopedNestedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeUseCaseFromNestedUseCasePipeline({useCaseIdToRemove: receivedUseCaseId, nestedUseCasePipelineId: receivedNestedUseCasePipelineId}: {useCaseIdToRemove: string, nestedUseCasePipelineId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {throw new Error("Use case not found")}

      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCasePipeline = allNestedUseCasesFromAllModules.find(scopedNestedUseCase => scopedNestedUseCase.id === receivedNestedUseCasePipelineId) as INestedUseCase

      if (!nestedUseCasePipeline) {throw new Error("Nested use case pipeline not found")}
      if (!nestedUseCasePipeline.useCasesPipelineIds.includes(receivedUseCaseId)) {
         throw new Error("Use case is not in pipeline")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCasePipeline.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.map(scopedNestedUseCase => {
                     if (scopedNestedUseCase.id === receivedNestedUseCasePipelineId) {
                        return {
                           ...scopedNestedUseCase,
                           useCasesPipelineIds: scopedNestedUseCase.useCasesPipelineIds.filter(scopedUseCaseId => scopedUseCaseId !== receivedUseCaseId)
                        }
                     }
                     return scopedNestedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }


   async readListOfNestedUseCasesByUseCaseId({useCaseId: receivedUseCaseId}: {useCaseId: string}): Promise<INestedUseCase[]> {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCases = allNestedUseCasesFromAllModules.filter((scopedNestedUseCase: INestedUseCase) => scopedNestedUseCase.parentUseCaseId === receivedUseCaseId)

      return nestedUseCases
   }
   async readListOfUseCasePipelineDependentsByUseCaseId({useCaseId: receivedUseCaseId}: {useCaseId: string}): Promise<IUseCase[]> {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      const ListOfDependents = allUseCasesFromAllModules.filter(scopedUseCase => scopedUseCase.useCasesPipelineIds.find(scopedUseCaseId => scopedUseCaseId === receivedUseCaseId))

      return ListOfDependents
   }
   async readListOfNestedUseCasePipelineDependentsByUseCaseId({useCaseId: receivedUseCaseId}: {useCaseId: string}): Promise<INestedUseCase[]> {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
         
      }, [])

      const useCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      const ListOfDependents = allNestedUseCasesFromAllModules.filter(scopedNestedUseCase => scopedNestedUseCase.useCasesPipelineIds.find(scopedUseCaseId => scopedUseCaseId === receivedUseCaseId))

      return ListOfDependents
   }

   async dragAndDropUseCase({dragUseCaseId: receivedDragUseCaseId, dropUseCaseId: receivedDropUseCaseId}: {dragUseCaseId: string, dropUseCaseId: string}) {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const dragUseCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedDragUseCaseId) as IUseCase

      if (!dragUseCase) {throw new Error("Drag use case not found")}

      const dropUseCase = allUseCasesFromAllModules.find(scopedUseCase => scopedUseCase.id === receivedDropUseCaseId) as IUseCase

      if (!dropUseCase) {throw new Error("Drop use case not found")}

      const module = this.ucfrLists.modules.find(scopedModule => scopedModule.id === dragUseCase.moduleId) as IModule

      if (!module) {throw new Error("Module not found")}

      const dragUseCaseIndex = module.useCases.findIndex(scopedUseCase => scopedUseCase.id === receivedDragUseCaseId)
      const dropUseCaseIndex = module.useCases.findIndex(scopedUseCase => scopedUseCase.id === receivedDropUseCaseId)

      const newUseCases = [...module.useCases]
      newUseCases.splice(dragUseCaseIndex, 1)
      newUseCases.splice(dropUseCaseIndex, 0, dragUseCase)

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === module.id) {
               return {
                  ...scopedModule,
                  useCases: newUseCases
               }
            }
            return scopedModule
         })
      })
   }

   // NESTED USE CASES
   async createNestedUseCase({name: receivedName, parentId: receivedParentId, moduleId: receivedModuleId}: {name: string, parentId: string, moduleId: string}): Promise<INestedUseCase> {
      if (receivedName.trim() === "") {
         throw new Error("Nested use case name cannot be empty")
      }
      // cannot be smaller than 2 characters
      if (receivedName.trim().length < 2) {
         throw new Error("Nested use case name must be at least 2 characters long")
      }
      // cannot be larger than 250 characters
      if (receivedName.trim().length > 250) {
         throw new Error("Nested use case name cannot be larger than 250 characters")
      }

      // check if parent use case exists
      const parentUseCase = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, []).find(useCase => useCase.id === receivedParentId) as IUseCase

      if (!parentUseCase) {
         throw new Error("Parent use case not found")
      }

      const module = this.ucfrLists.modules.find(scopedModule => scopedModule.id === receivedModuleId) as IModule

      if (!module) {
         throw new Error("Module not found")
      }

      const nestedUseCase: INestedUseCase = {
         id: GenerateUUID(),
         name: receivedName,
         parentUseCaseId: receivedParentId,
         moduleId: receivedModuleId,
         completed: false,
         tagIds: [],
         neededFrsToWorkIds: [],
         useCasesPipelineIds: [],
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === receivedModuleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: [...scopedModule.nestedUseCases, nestedUseCase]
               }
            }
            return scopedModule
         })
      })

      return nestedUseCase
   }
   async readNestedUseCaseById({nestedUseCaseId: receivedNestedUseCaseId}: {nestedUseCaseId: string}): Promise<INestedUseCase> {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedNestedUseCaseId) as INestedUseCase

      if (!nestedUseCase) {
         throw new Error("Nested use case not found")
      }

      return nestedUseCase
   }
   async updateNestedUseCaseById({nestedUseCaseId: receivedNestedUseCaseId, name: receivedName, completed: receivedCompleted}: {nestedUseCaseId: string, name: string, completed: boolean}) {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCase = allNestedUseCasesFromAllModules.find(scopedNestedUseCase => scopedNestedUseCase.id === receivedNestedUseCaseId) as INestedUseCase

      if (!nestedUseCase) {
         throw new Error("Nested use case not found")
      }

      if (receivedName.trim() === "") {
         throw new Error("Nested use case name cannot be empty")
      }
      // cannot be smaller than 2 characters
      if (receivedName.trim().length < 2) {
         throw new Error("Nested use case name must be at least 2 characters long")
      }
      // cannot be larger than 250 characters
      if (receivedName.trim().length > 250) {
         throw new Error("Nested use case name cannot be larger than 250 characters")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCase.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.map(scopedNestedUseCase => {
                     if (scopedNestedUseCase.id === receivedNestedUseCaseId) {
                        return {
                           ...scopedNestedUseCase,
                           name: receivedName,
                           completed: receivedCompleted
                        }
                     }
                     return scopedNestedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeNestedUseCaseById({nestedUseCaseId: receivedNestedUseCaseId}: {nestedUseCaseId: string}) {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedNestedUseCaseId) as INestedUseCase

      if (!nestedUseCase) {
         throw new Error("Nested use case not found")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCase.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.filter(scopedNestedUseCase => scopedNestedUseCase.id !== receivedNestedUseCaseId)
               }
            }
            return scopedModule
         })
      })
   }

   async dragAndDropNestedUseCase({dragNestedUseCaseId: receivedDragNestedUseCaseId, dropNestedUseCaseId: receivedDropNestedUseCaseId}: {dragNestedUseCaseId: string, dropNestedUseCaseId: string}) {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const dragNestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedDragNestedUseCaseId) as INestedUseCase

      if (!dragNestedUseCase) { throw new Error("Drag nested use case not found") }

      const dropNestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedDropNestedUseCaseId) as INestedUseCase

      if (!dropNestedUseCase) { throw new Error("Drop nested use case not found") }

      const nestedUseCasesList = this.ucfrLists.modules.find(scopedModule => scopedModule.id === dragNestedUseCase.moduleId)?.nestedUseCases as INestedUseCase[]

      const nestedUseCasesWithoutSameParentIdList = nestedUseCasesList.filter(nestedUseCase => nestedUseCase.parentUseCaseId !== dragNestedUseCase.parentUseCaseId)

      const nestedUseCasesWithSameParentIdList = nestedUseCasesList.filter(nestedUseCase => nestedUseCase.parentUseCaseId === dragNestedUseCase.parentUseCaseId)

      const dragNestedUseCaseIndex = nestedUseCasesWithSameParentIdList.findIndex(nestedUseCase => nestedUseCase.id === dragNestedUseCase.id)
      const dropNestedUseCaseIndex = nestedUseCasesWithSameParentIdList.findIndex(nestedUseCase => nestedUseCase.id === dropNestedUseCase.id)
      
      const newNestedUseCasesWithSameParentIdList = [...nestedUseCasesWithSameParentIdList]

      newNestedUseCasesWithSameParentIdList.splice(dragNestedUseCaseIndex, 1)
      newNestedUseCasesWithSameParentIdList.splice(dropNestedUseCaseIndex, 0, dragNestedUseCase)

      const newNestedUseCasesList = [...nestedUseCasesWithoutSameParentIdList, ...newNestedUseCasesWithSameParentIdList]

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === dragNestedUseCase.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: newNestedUseCasesList
               }
            }
            return scopedModule
         }
      )})
   }


   // FUNCTIONAL REQUIREMENTS
   async createFunctionalRequirement({name: receivedName, moduleId: receivedModuleId}: {name: string, moduleId: string}): Promise<IFunctionalRequirement> {
      if (receivedName.trim() === "") {
         throw new Error("Functional requirement name cannot be empty")
      }
      // cannot be smaller than 2 characters
      if (receivedName.trim().length < 2) {
         throw new Error("Functional requirement name must be at least 2 characters long")
      }
      // cannot be larger than 250 characters
      if (receivedName.trim().length > 250) {
         throw new Error("Functional requirement name cannot be larger than 250 characters")
      }

      const module = this.ucfrLists.modules.find(scopedModule => scopedModule.id === receivedModuleId) as IModule

      if (!module) {
         throw new Error("Module not found")
      }

      const functionalRequirement: IFunctionalRequirement = {
         id: GenerateUUID(),
         name: receivedName,
         moduleId: receivedModuleId,
         done: false,
         tagIds: [],
         frDependencies: [],
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === receivedModuleId) {
               return {
                  ...scopedModule,
                  functionalRequirements: [...scopedModule.functionalRequirements, functionalRequirement]
               }
            }
            return scopedModule
         })
      })

      return functionalRequirement
   }
   async readFunctionalRequirementById({functionalRequirementId: receivedFunctionalRequirementId}: {functionalRequirementId: string}): Promise<IFunctionalRequirement> {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      return functionalRequirement
   }
   async updateFunctionalRequirementById({functionalRequirementId: receivedFunctionalRequirementId, name: receivedName, done: receivedDone}: {functionalRequirementId: string, name: string, done: boolean}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(scopedFunctionalRequirement => scopedFunctionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      if (receivedName.trim() === "") {
         throw new Error("Functional requirement name cannot be empty")
      }
      // cannot be smaller than 2 characters
      if (receivedName.trim().length < 2) {
         throw new Error("Functional requirement name must be at least 2 characters long")
      }
      // cannot be larger than 250 characters
      if (receivedName.trim().length > 250) {
         throw new Error("Functional requirement name cannot be larger than 250 characters")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === functionalRequirement.moduleId) {
               return {
                  ...scopedModule,
                  functionalRequirements: scopedModule.functionalRequirements.map(scopedFunctionalRequirement => {
                     if (scopedFunctionalRequirement.id === receivedFunctionalRequirementId) {
                        return {
                           ...scopedFunctionalRequirement,
                           name: receivedName,
                           done: receivedDone
                        }
                     }
                     return scopedFunctionalRequirement
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeFunctionalRequirementById({functionalRequirementId: receivedFunctionalRequirementId}: {functionalRequirementId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      // cannot delete a functional requirement if it is a dependency of another functional requirement
      const isDependency = (await this.readListOfFunctionalRequirementDependentsById({functionalRequirementId: receivedFunctionalRequirementId})).length > 0
      if (isDependency) {
         throw new Error("Cannot delete a functional requirement that is a dependency of another functional requirement")
      }
      // cannot delete a functional requirement if it is a dependency of a use case
      const isDependencyOfUseCase = (await this.readListOfUseCaseDependentsById({functionalRequirementId: receivedFunctionalRequirementId})).length > 0
      if (isDependencyOfUseCase) {
         throw new Error("Cannot delete a functional requirement that is a dependency of a use case")
      }
      // cannot delete a functional requirement if it is a dependency of a nested use case
      const isDependencyOfNestedUseCase = (await this.readListOfNestedUseCaseDependentsById({functionalRequirementId: receivedFunctionalRequirementId})).length > 0
      if (isDependencyOfNestedUseCase) {
         throw new Error("Cannot delete a functional requirement that is a dependency of a nested use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === functionalRequirement.moduleId) {
               return {
                  ...scopedModule,
                  functionalRequirements: scopedModule.functionalRequirements.filter(scopedFunctionalRequirement => scopedFunctionalRequirement.id !== receivedFunctionalRequirementId)
               }
            }
            return scopedModule
         }
         )
      })
   }
   // FUNCTIONAL REQUIREMENT ACTIONS
   async readListOfFunctionalRequirementDependentsById({functionalRequirementId: receivedFunctionalRequirementId}: {functionalRequirementId: string}): Promise<IFunctionalRequirement[]> {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      const listOfFunctionalRequirementDependents = allFunctionalRequirementsFromAllModules.filter(scopedFunctionalRequirement => scopedFunctionalRequirement.frDependencies.some(frDependency => frDependency === receivedFunctionalRequirementId))

      return listOfFunctionalRequirementDependents
   }
   async readListOfUseCaseDependentsById({functionalRequirementId: receivedFunctionalRequirementId}: {functionalRequirementId: string}): Promise<IUseCase[]> {
      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const listOfUseCaseDependents = allUseCasesFromAllModules.filter(scopedUseCase => scopedUseCase.frDependencies.some(frDependency => frDependency === receivedFunctionalRequirementId))

      return listOfUseCaseDependents
   }
   async readListOfNestedUseCaseDependentsById({functionalRequirementId: receivedFunctionalRequirementId}: {functionalRequirementId: string}): Promise<IUseCase[]> {
      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const listOfNestedUseCaseDependents = allNestedUseCasesFromAllModules.filter(scopedNestedUseCase => scopedNestedUseCase.frDependencies.some(frDependency => frDependency === receivedFunctionalRequirementId))

      return listOfNestedUseCaseDependents
   }

   async addFunctionalRequirementToUseCase({functionalRequirementId: receivedFunctionalRequirementId, useCaseId: receivedUseCaseId}: {functionalRequirementId: string, useCaseId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      // cannot add a functional requirement that is already a dependency of the use case
      const isDependency = useCase.neededFrsToWorkIds.some(frDependency => frDependency === receivedFunctionalRequirementId)
      if (isDependency) {
         throw new Error("Cannot add a functional requirement that is already a dependency of the use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCase.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.map(scopedUseCase => {
                     if (scopedUseCase.id === receivedUseCaseId) {
                        return {
                           ...scopedUseCase,
                           frDependencies: [...scopedUseCase.neededFrsToWorkIds, receivedFunctionalRequirementId]
                        }
                     }
                     return scopedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeFunctionalRequirementFromUseCase({functionalRequirementId: receivedFunctionalRequirementId, useCaseId: receivedUseCaseId}: {functionalRequirementId: string, useCaseId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      const allUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.useCases]
      }, [])

      const useCase = allUseCasesFromAllModules.find(useCase => useCase.id === receivedUseCaseId) as IUseCase

      if (!useCase) {
         throw new Error("Use case not found")
      }

      // cannot remove a functional requirement that is not a dependency of the use case
      const isDependency = useCase.neededFrsToWorkIds.some(frDependency => frDependency === receivedFunctionalRequirementId)
      if (!isDependency) {
         throw new Error("Cannot remove a functional requirement that is not a dependency of the use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === useCase.moduleId) {
               return {
                  ...scopedModule,
                  useCases: scopedModule.useCases.map(scopedUseCase => {
                     if (scopedUseCase.id === receivedUseCaseId) {
                        return {
                           ...scopedUseCase,
                           frDependencies: scopedUseCase.neededFrsToWorkIds.filter(frDependency => frDependency !== receivedFunctionalRequirementId)
                        }
                     }
                     return scopedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }

   async addFunctionalRequirementToNestedUseCase({functionalRequirementId: receivedFunctionalRequirementId, nestedUseCaseId: receivedNestedUseCaseId}: {functionalRequirementId: string, nestedUseCaseId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedNestedUseCaseId) as INestedUseCase

      if (!nestedUseCase) {
         throw new Error("Nested use case not found")
      }

      // cannot add a functional requirement that is already a dependency of the nested use case
      const isDependency = nestedUseCase.neededFrsToWorkIds.some(frDependency => frDependency === receivedFunctionalRequirementId)
      if (isDependency) {
         throw new Error("Cannot add a functional requirement that is already a dependency of the nested use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCase.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.map(scopedNestedUseCase => {
                     if (scopedNestedUseCase.id === receivedNestedUseCaseId) {
                        return {
                           ...scopedNestedUseCase,
                           frDependencies: [...scopedNestedUseCase.neededFrsToWorkIds, receivedFunctionalRequirementId]
                        }
                     }
                     return scopedNestedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }
   async removeFunctionalRequirementFromNestedUseCase({functionalRequirementId: receivedFunctionalRequirementId, nestedUseCaseId: receivedNestedUseCaseId}: {functionalRequirementId: string, nestedUseCaseId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      const allNestedUseCasesFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.nestedUseCases]
      }, [])

      const nestedUseCase = allNestedUseCasesFromAllModules.find(nestedUseCase => nestedUseCase.id === receivedNestedUseCaseId) as INestedUseCase

      if (!nestedUseCase) {
         throw new Error("Nested use case not found")
      }

      // cannot remove a functional requirement that is not a dependency of the nested use case
      const isDependency = nestedUseCase.neededFrsToWorkIds.some(frDependency => frDependency === receivedFunctionalRequirementId)
      if (!isDependency) {
         throw new Error("Cannot remove a functional requirement that is not a dependency of the nested use case")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            if (scopedModule.id === nestedUseCase.moduleId) {
               return {
                  ...scopedModule,
                  nestedUseCases: scopedModule.nestedUseCases.map(scopedNestedUseCase => {
                     if (scopedNestedUseCase.id === receivedNestedUseCaseId) {
                        return {
                           ...scopedNestedUseCase,
                           frDependencies: scopedNestedUseCase.neededFrsToWorkIds.filter(frDependency => frDependency !== receivedFunctionalRequirementId)
                        }
                     }
                     return scopedNestedUseCase
                  })
               }
            }
            return scopedModule
         })
      })
   }

   async addFunctionalRequirementToFunctionalRequirement({functionalRequirementId: receivedFunctionalRequirementId, functionalRequirementReceiverId: receivedFunctionalRequirementReceiverId}: {functionalRequirementId: string, functionalRequirementReceiverId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      const functionalRequirementReceiver = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementReceiverId) as IFunctionalRequirement

      if (!functionalRequirementReceiver) {
         throw new Error("Functional requirement receiver not found")
      }

      // cannot add a functional requirement that is already a dependency of the functional requirement receiver
      const isDependency = functionalRequirementReceiver.frDependencies.some(frDependency => frDependency === receivedFunctionalRequirementId)
      if (isDependency) {
         throw new Error("Cannot add a functional requirement that is already a dependency of the functional requirement receiver")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            return {
               ...scopedModule,
               functionalRequirements: scopedModule.functionalRequirements.map(scopedFunctionalRequirement => {
                  if (scopedFunctionalRequirement.id === receivedFunctionalRequirementReceiverId) {
                     return {
                        ...scopedFunctionalRequirement,
                        frDependencies: [...scopedFunctionalRequirement.frDependencies, receivedFunctionalRequirementId]
                     }
                  }
                  return scopedFunctionalRequirement
               })
            }
         })
      })
   }
   async removeFunctionalRequirementFromFunctionalRequirement({functionalRequirementId: receivedFunctionalRequirementId, functionalRequirementReceiverId: receivedFunctionalRequirementReceiverId}: {functionalRequirementId: string, functionalRequirementReceiverId: string}) {
      const allFunctionalRequirementsFromAllModules = this.ucfrLists.modules.reduce((acc, module) => {
         return [...acc, ...module.functionalRequirements]
      }, [])

      const functionalRequirement = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementId) as IFunctionalRequirement

      if (!functionalRequirement) {
         throw new Error("Functional requirement not found")
      }

      const functionalRequirementReceiver = allFunctionalRequirementsFromAllModules.find(functionalRequirement => functionalRequirement.id === receivedFunctionalRequirementReceiverId) as IFunctionalRequirement

      if (!functionalRequirementReceiver) {
         throw new Error("Functional requirement receiver not found")
      }

      // cannot remove a functional requirement that is not a dependency of the functional requirement receiver
      const isDependency = functionalRequirementReceiver.frDependencies.some(frDependency => frDependency === receivedFunctionalRequirementId)
      if (!isDependency) {
         throw new Error("Cannot remove a functional requirement that is not a dependency of the functional requirement receiver")
      }

      this.setUcfrLists({
         ...this.ucfrLists,
         modules: this.ucfrLists.modules.map(scopedModule => {
            return {
               ...scopedModule,
               functionalRequirements: scopedModule.functionalRequirements.map(scopedFunctionalRequirement => {
                  if (scopedFunctionalRequirement.id === receivedFunctionalRequirementReceiverId) {
                     return {
                        ...scopedFunctionalRequirement,
                        frDependencies: scopedFunctionalRequirement.frDependencies.filter(frDependency => frDependency !== receivedFunctionalRequirementId)
                     }
                  }
                  return scopedFunctionalRequirement
               })
            }
         })
      })
   }
}