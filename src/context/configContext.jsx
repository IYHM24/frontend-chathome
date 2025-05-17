import { createContext, useState } from 'react'

export const ConfigContext = createContext(null)

export const ConfigProvider = ({children}) => {

    const [remember, setRemember] = useState(
        localStorage.getItem("remember")? 
            localStorage.getItem("remember")
        :
            false  
    );

    return (
        <ConfigContext.Provider 
            value={{
               remember,
                setRemember
            }}
        >
            {children}
        </ConfigContext.Provider>
    )
}


