const bcrypt = require('bcrypt');

// Script para generar el hash de la contraseña del administrador
const generarHashPassword = async () => {
    const password = 'admin123'; // Contraseña por defecto
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash generado para password "admin123":');
    console.log(hash);
    console.log('\nUsa este hash en el archivo database/schema.sql');
};

generarHashPassword();
