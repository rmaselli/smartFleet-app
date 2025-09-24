const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugDatabasePhotos() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Debuggeando datos de fotos en la base de datos...');
    
    // Verificar fotos de motocicleta
    console.log('\n📸 Fotos de motocicleta (FLVEH_F001):');
    const [fotosMotocicleta] = await connection.execute(
      'SELECT id_foto, tipo_foto, tipo_mime, LENGTH(foto) as foto_length, LEFT(foto, 100) as foto_preview FROM FLVEHI.FLVEH_F001 WHERE id_hoja = 87 LIMIT 3'
    );
    
    fotosMotocicleta.forEach((foto, index) => {
      console.log(`\n  Foto ${index + 1}:`);
      console.log(`    ID: ${foto.id_foto}`);
      console.log(`    Tipo: ${foto.tipo_foto}`);
      console.log(`    MIME: ${foto.tipo_mime}`);
      console.log(`    Longitud: ${foto.foto_length} bytes`);
      console.log(`    Preview: ${foto.foto_preview}`);
      console.log(`    Es base64: ${foto.foto_preview.startsWith('data:')}`);
    });
    
    // Verificar fotos de items
    console.log('\n🔧 Fotos de items (FLVEH_F002):');
    const [fotosItems] = await connection.execute(
      'SELECT id_foto_item, id_check, tipo_mime, LENGTH(foto) as foto_length, LEFT(foto, 100) as foto_preview FROM FLVEHI.FLVEH_F002 WHERE id_hoja = 87 LIMIT 3'
    );
    
    fotosItems.forEach((foto, index) => {
      console.log(`\n  Foto Item ${index + 1}:`);
      console.log(`    ID: ${foto.id_foto_item}`);
      console.log(`    Check: ${foto.id_check}`);
      console.log(`    MIME: ${foto.tipo_mime}`);
      console.log(`    Longitud: ${foto.foto_length} bytes`);
      console.log(`    Preview: ${foto.foto_preview}`);
      console.log(`    Es base64: ${foto.foto_preview.startsWith('data:')}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugDatabasePhotos();
