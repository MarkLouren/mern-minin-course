import {useCallback} from 'react'

//useCallback - для того, чтобы реакт не входил в цикличный рендеринг
export const useMessage = ()=>{
return useCallback( (text)=>{
    if (window.M&&text){
        window.M.toast({html:text})     //M-global object from Materialize lib. toast -method (popup)
    }
},[])
}