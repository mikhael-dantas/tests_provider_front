import React from "react";


export interface ITag {
   id: string;
   name: string;
   description: string;
}
export interface IModule {
   id: string
   name: string
}
export interface IUseCase {
   id: string
   moduleId: string
   tagIds: string[]
   name: string
   completed: boolean
   neededFrsToWorkIds: string[]
   usecasesPipelineIds: string[]
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
export interface IUcfrLists {
   tags: ITag[]
   modules: IModule[]
   useCases: IUseCase[]
   nestedUseCases: INestedUseCase[]
   functionalRequirements: IFunctionalRequirement[]
}

const ucfrListsContext = React.createContext<IUcfrLists>(null)
const updateUcfrListsContext = React.createContext<React.Dispatch<React.SetStateAction<IUcfrLists>>>(null)

const currentModuleContext = React.createContext<IModule>(null)
const updateCurrentModuleContext = React.createContext<React.Dispatch<React.SetStateAction<IModule>>>(null)

export function UcfrsProvider({children}) {
   const [ucfrLists, setUcfrLists] = React.useState<IUcfrLists>({
      tags: [],
      modules: [],
      useCases: [],
      nestedUseCases: [],
      functionalRequirements: []
   })

   const [currentModule, setCurrentModule] = React.useState<IModule | undefined>(undefined)

   return (
      <ucfrListsContext.Provider value={ucfrLists}>
      <updateUcfrListsContext.Provider value={setUcfrLists}>
         <currentModuleContext.Provider value={currentModule}>
         <updateCurrentModuleContext.Provider value={setCurrentModule}>
            {children}
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