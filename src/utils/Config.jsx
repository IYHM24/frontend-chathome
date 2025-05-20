import React from 'react'
import { validarConfiguracionHora } from './timeOperations';
import { useEffect } from 'react';

export const ConfigComponent = ({ children }) => {

    setTimeout(async () => {
        const horaEsValida = await validarConfiguracionHora();
        if (!horaEsValida) {
            alert('Por favor, configure correctamente la hora de su dispositivo');
            sessionStorage.clear();
            localStorage.clear();
            window.location.reload();
        }
    }, 1000);

    useEffect(() => {
    }, [])

    return (
        <>
            {children}
        </>
    )
}
