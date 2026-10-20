const pool = require('./db');

async function probarConexion() {
    try {
        const resultado = await pool.query(
            'SELECT id, titulo, completada FROM tareas ORDER BY id'
        );

        console.log('Conexión exitosa con PostgreSQL');
        console.log('Tareas encontradas:');
        console.table(resultado.rows);
    } catch (error) {
        console.error('Error al conectar con PostgreSQL:');
        console.error(error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

probarConexion();