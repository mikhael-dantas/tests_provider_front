import React from "react";


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