import { Flex } from "@chakra-ui/react";
import React from "react";


const popupComponentContext = React.createContext<JSX.Element>(null)
const updatePopupComponentContext = React.createContext<React.Dispatch<React.SetStateAction<JSX.Element>>>(null)

const popupComponentDisplayContext = React.createContext<boolean>(null)
const updatePopupComponentDisplayContext = React.createContext<React.Dispatch<React.SetStateAction<boolean>>>(null)

export function PopupProvider({children}) {
   const [popupComponent, setPopupComponent] = React.useState<JSX.Element>(<></>)

   const [popupComponentDisplay, setPopupComponentDisplay] = React.useState<boolean>(true)

   return (
      <popupComponentContext.Provider value={popupComponent}>
      <updatePopupComponentContext.Provider value={setPopupComponent}>
         <popupComponentDisplayContext.Provider value={popupComponentDisplay}>
         <updatePopupComponentDisplayContext.Provider value={setPopupComponentDisplay}>
         <Flex className='popup'
         display={popupComponentDisplay ? 'flex' : 'none'}
         width={'100%'} minHeight={'100vh'} 
         alignItems={'center'} justifyContent={'center'}
         position={'absolute'}
         zIndex={1}
         >
            <Flex className='popupBackground'
            width={'100%'} minHeight={'100vh'} 
            alignItems={'center'} justifyContent={'center'}
            position={'absolute'}
            zIndex={1}
            backgroundColor={'#222'}
            opacity={0.7}
            onClick={() => { setPopupComponentDisplay(!popupComponentDisplay)}}
            />
            
            <Flex 
            zIndex={2} width={'100%'}>
               {popupComponent}
            </Flex>
         </Flex>
            {children}
         </updatePopupComponentDisplayContext.Provider>
         </popupComponentDisplayContext.Provider>
      </updatePopupComponentContext.Provider>
      </popupComponentContext.Provider>
   )
}

export function usePopupComponentContext() {
   const popupComponent = React.useContext(popupComponentContext)
   return popupComponent
}
export function useUpdatePopupComponentContext() {
   const updatePopupComponent = React.useContext(updatePopupComponentContext)
   return updatePopupComponent
}

export function usePopupComponentDisplayContext() {
   const popupComponentDisplay = React.useContext(popupComponentDisplayContext)
   return popupComponentDisplay
}
export function useUpdatePopupComponentDisplayContext() {
   const updatePopupComponentDisplay = React.useContext(updatePopupComponentDisplayContext)
   return updatePopupComponentDisplay
}
