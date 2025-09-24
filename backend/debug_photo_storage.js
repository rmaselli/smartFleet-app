const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugPhotoStorage() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Debuggeando almacenamiento de fotos...');
    
    // Verificar fotos de motocicleta
    console.log('\n📋 Fotos de motocicleta (FLVEH_F001):');
    const [fotosMotocicleta] = await connection.execute('SELECT id_foto, tipo_foto, nombre_archivo, tipo_mime, LENGTH(foto) as tamano_foto FROM FLVEHI.FLVEH_F001 ORDER BY id_foto DESC LIMIT 5');
    
    if (fotosMotocicleta.length === 0) {
      console.log('❌ No hay fotos de motocicleta');
    } else {
      fotosMotocicleta.forEach(foto => {
        console.log(`  - ID: ${foto.id_foto}, Tipo: ${foto.tipo_foto}, Archivo: ${foto.nombre_archivo}, MIME: ${foto.tipo_mime}, Tamaño: ${foto.tamano_foto} bytes`);
      });
    }
    
    // Verificar fotos de items
    console.log('\n📋 Fotos de items (FLVEH_F002):');
    const [fotosItems] = await connection.execute('SELECT id_foto_item, id_check, nombre_archivo, tipo_mime, LENGTH(foto) as tamano_foto FROM FLVEHI.FLVEH_F002 ORDER BY id_foto_item DESC LIMIT 5');
    
    if (fotosItems.length === 0) {
      console.log('❌ No hay fotos de items');
    } else {
      fotosItems.forEach(foto => {
        console.log(`  - ID: ${foto.id_foto_item}, Check: ${foto.id_check}, Archivo: ${foto.nombre_archivo}, MIME: ${foto.tipo_mime}, Tamaño: ${foto.tamano_foto} bytes`);
      });
    }
    
    // Verificar si las fotos son base64
    if (fotosMotocicleta.length > 0) {
      console.log('\n📋 Verificando formato de datos de foto de motocicleta:');
      const [fotoData] = await connection.execute('SELECT SUBSTRING(foto, 1, 50) as inicio_datos FROM FLVEHI.FLVEH_F001 WHERE id_foto = ?', [fotosMotocicleta[0].id_foto]);
      const inicio = fotoData[0].inicio_datos;
      console.log(`Inicio de datos: ${inicio}`);
      
      if (inicio.startsWith('data:image/')) {
        console.log('✅ Las fotos están almacenadas como base64');
      } else {
        console.log('❌ Las fotos NO están en formato base64');
      }
    }

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugPhotoStorage();
