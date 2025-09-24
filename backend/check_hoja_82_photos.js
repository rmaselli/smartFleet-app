const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkHoja82Photos() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'p3rson4l',
      database: process.env.DB_NAME || 'FLVEHI'
    });

    console.log('🔍 Verificando hoja 82 y sus fotos...');
    
    // Verificar si existe la hoja 82
    console.log('\n📋 Verificando hoja 82 en FLVEH_T001...');
    const [hoja] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T001 WHERE id_hoja = 82');
    
    if (hoja.length === 0) {
      console.log('❌ Hoja 82 no encontrada en FLVEH_T001');
    } else {
      console.log('✅ Hoja 82 encontrada:');
      console.log(`  - ID: ${hoja[0].id_hoja}`);
      console.log(`  - Estado: ${hoja[0].estado}`);
      console.log(`  - Plataforma: ${hoja[0].id_plataforma}`);
      console.log(`  - Piloto: ${hoja[0].id_piloto}`);
      console.log(`  - Fecha: ${hoja[0].fe_registro}`);
    }
    
    // Verificar items revisados
    console.log('\n📋 Verificando items revisados en FLVEH_T002...');
    const [items] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_T002 WHERE id_hoja = 82');
    console.log(`Items revisados: ${items.length}`);
    items.forEach(item => {
      console.log(`  - Item ${item.id_check}: ${item.anotacion}`);
    });
    
    // Verificar fotos de motocicleta
    console.log('\n📋 Verificando fotos de motocicleta en FLVEH_F001...');
    const [fotosMotocicleta] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_F001 WHERE id_hoja = 82');
    console.log(`Fotos de motocicleta: ${fotosMotocicleta.length}`);
    fotosMotocicleta.forEach(foto => {
      console.log(`  - Tipo: ${foto.tipo_foto}, Estado: ${foto.estado}, Fecha: ${foto.fe_registro}`);
    });
    
    // Verificar fotos de items
    console.log('\n📋 Verificando fotos de items en FLVEH_F002...');
    const [fotosItems] = await connection.execute('SELECT * FROM FLVEHI.FLVEH_F002 WHERE id_hoja = 82');
    console.log(`Fotos de items: ${fotosItems.length}`);
    fotosItems.forEach(foto => {
      console.log(`  - Item: ${foto.id_check}, Estado: ${foto.estado}, Fecha: ${foto.fe_registro}`);
    });
    
    // Verificar últimas hojas creadas
    console.log('\n📋 Últimas 5 hojas creadas...');
    const [ultimasHojas] = await connection.execute('SELECT id_hoja, estado, fe_registro FROM FLVEHI.FLVEH_T001 ORDER BY id_hoja DESC LIMIT 5');
    ultimasHojas.forEach(hoja => {
      console.log(`  - Hoja ${hoja.id_hoja}: Estado ${hoja.estado}, Fecha ${hoja.fe_registro}`);
    });

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkHoja82Photos();
