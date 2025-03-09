// middlewares/contarOperaciones.js
let operacionesCount = 0;  // Mantener el contador en este archivo

const contarOperaciones = (req, res, next) => {
    operacionesCount++;  // Incrementa el contador
    console.log(`Operación número: ${operacionesCount}`);
    
    // Añadir el contador al objeto request para que esté disponible en los controladores
    req.operacionesCount = operacionesCount;
    
    next();
};

// Exportar tanto el middleware como una función para obtener el contador
module.exports = { 
    contarOperaciones,
    getOperacionesCount: () => operacionesCount 
};