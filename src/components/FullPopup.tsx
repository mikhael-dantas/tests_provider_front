// black screen rendering children inside it

import { Flex } from "@chakra-ui/react"
import React from "react"

export default function FullPopup({display, setDisplay, children}) {

   return (
      <Flex className='popup'
         display={display ? 'flex' : 'none'}
         width={'100%'} minHeight={'100vh'} 
         alignItems={'center'} justifyContent={'center'}
         position={'absolute'}
         bottom={'0'}
         zIndex={98}
         >
            <Flex className='popupBackground'
            width={'100%'} minHeight={'100vh'} 
            alignItems={'center'} justifyContent={'center'}
            position={'absolute'}
            zIndex={98}
            backgroundColor={'#222'}
            opacity={0.7}
            onClick={() => { setDisplay(!display)}}
            />
            
            <Flex 
            zIndex={99} width={'100%'}>
               {children}
            </Flex>
         </Flex>
   )
}