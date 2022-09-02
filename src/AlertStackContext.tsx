import { Alert, AlertIcon, Flex, Stack } from "@chakra-ui/react";
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
         zIndex={10}
         >
            {alertStackComponent.map((fAlertStackComponentItem) => {
               return (
                  fAlertStackComponentItem.component
               )
            })}
            {alertStackComponent.length > 0 && <button onClick={dismissAllAlerts}>Dismiss All</button>}
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
   const updatealertStackComponent = React.useContext(updateAlertStackComponentContext)
   return updatealertStackComponent
}

export interface IAlertStackGenerateDTO {
   status: 'error' | 'success' | 'warning' | 'info',
   text: string,
   timeout?: number
}

export function GenerateAlertComponent({status, text}: IAlertStackGenerateDTO) {
   const alertComponent = (
      <Alert status={status}>
         <AlertIcon />
         {text}
      </Alert>
   )

   return alertComponent
}

// got a hook rule error trying to use this outside of this component
// export function PushAlertToAlertStackContextFunction() {
//    const pushAlertToAlertStack = ({status, text}: IAlertStackGenerateDTO) => {
//       const alertStackComponent = useAlertStackComponentContext()
//       const updateAlertStackComponent = useUpdateAlertStackComponentContext()
      
//       const generatedId = GenerateUUID()

//       const destroyComponent = (id: string) => {
//          updateAlertStackComponent(alertStackComponent.filter(a => a.id !== id))
//       }

//       const alertComponent = (
//          <Alert status={status}>
//             <AlertIcon />
//             {text}
//          </Alert>
//       )

//       updateAlertStackComponent([...alertStackComponent, {id: generatedId, component: alertComponent}])

//       // destroy after 5 seconds
//       setTimeout(() => {
//          destroyComponent(generatedId)
//       }
//       , 5000)
//    }

//    return pushAlertToAlertStack
// }

