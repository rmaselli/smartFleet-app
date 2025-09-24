const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugStorageFormat() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Debuggeando formato de almacenamiento...');
    
    // Verificar una foto de la hoja 89
    const [fotos] = await connection.execute(
      'SELECT id_foto, tipo_foto, tipo_mime, LEFT(foto, 300) as foto_preview FROM FLVEHI.FLVEH_F001 WHERE id_hoja = 89 LIMIT 1'
    );
    
    if (fotos.length > 0) {
      const foto = fotos[0];
      console.log('📸 Foto encontrada:');
      console.log(`  ID: ${foto.id_foto}`);
      console.log(`  Tipo: ${foto.tipo_foto}`);
      console.log(`  MIME: ${foto.tipo_mime}`);
      console.log(`  Preview (primeros 300 chars): ${foto.foto_preview}`);
      
      // Decodificar el base64 doble para ver qué contiene realmente
      try {
        const decoded = Buffer.from(foto.foto_preview.split(',')[1] || foto.foto_preview, 'base64').toString();
        console.log(`  Decodificado: ${decoded.substring(0, 100)}...`);
        console.log(`  Es base64 válido decodificado: ${decoded.startsWith('data:')}`);
      } catch (e) {
        console.log(`  Error decodificando: ${e.message}`);
      }
    }

    await connection.end();
    console.log('✅ Debug completado');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugStorageFormat();
