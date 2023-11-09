import React from 'react'

export const Button: React.FC<React.PropsWithChildren> = ({children}) => {
    
    return <button style={{ background: "red" }}>{children}</button>
}

