import { Alert, AlertIcon, Stack } from "@chakra-ui/react";
import { GenerateUUID } from "@myUtils/UUIDGenerator";
import React from "react";

export interface IAlertStackComponentArrayItem {
   component: JSX.Element;
}
const alertStackComponentContext = React.createContext<IAlertStackComponentArrayItem[]>([]);
const updateAlertStackComponentContext = React.createContext<React.Dispatch<React.SetStateAction<IAlertStackComponentArrayItem[]>>>(() => { });

export function AlertStackProvider({children}) {
   const [alertStackComponent, setAlertStackComponent] = React.useState<IAlertStackComponentArrayItem[]>([])

   const dismissAllAlerts = () => {
      setAlertStackComponent([])
   }

   // use effect to remove alert after 5 seconds updated
   React.useEffect(() => {
      const interval = setInterval(() => {
         if (alertStackComponent.length > 0) {
            setAlertStackComponent(alertStackComponent.slice(1))
         }
      }, 4000)
      return () => clearInterval(interval)
   }, [alertStackComponent])

   return (
      <alertStackComponentContext.Provider value={alertStackComponent}>
      <updateAlertStackComponentContext.Provider value={setAlertStackComponent}>
         {children}
         <Stack spacing={3}
         position='fixed'
         bottom='0'
         left='0'
         zIndex={2000}
         >
            {alertStackComponent.map((fAlertStackComponentItem) => {
               return (
                  fAlertStackComponentItem.component
               )
            })}
            {alertStackComponent.length > 0 && <button 
            onClick={dismissAllAlerts}
            style={{
               backgroundColor: 'white',
               boxShadow: '0 0 0 1px rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.05)',
            }}
            >Dismiss All</button>}
         </Stack>
      </updateAlertStackComponentContext.Provider>
      </alertStackComponentContext.Provider>
   )
}

export function useAlertStackComponentContext() {
   const alertStackComponent = React.useContext(alertStackComponentContext)
   return alertStackComponent
}
export function useUpdateAlertStackComponentContext() {
   const updateAlertStackComponent = React.useContext(updateAlertStackComponentContext)
   return updateAlertStackComponent
}

export interface IAlertStackGenerateDTO {
   status: 'error' | 'success' | 'warning' | 'info',
   text: string,
   timeout?: number
}

export function GenerateAlertComponent({status, text}: IAlertStackGenerateDTO) {
   const alertComponent = (
      <Alert key={GenerateUUID()} status={status}>
         <AlertIcon />
         {text}
      </Alert>
   )

   return alertComponent
}