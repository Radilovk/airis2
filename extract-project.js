#!/usr/bin/env node
/**
 * AIRIS Project Export Extractor
 * Конвертира JSON експорт към файлова структура
 * 
 * Usage: node extract-project.js <export-file.json>
 */

const fs = require('fs');
const path = require('path');

function extractProject(jsonFile) {
  console.log('🚀 AIRIS Project Extractor');
  console.log('═'.repeat(50));
  
  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ Файлът "${jsonFile}" не съществува!`);
    process.exit(1);
  }

  console.log(`📂 Четене на: ${jsonFile}`);
  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  
  console.log(`📦 Проект: ${data.project}`);
  console.log(`📅 Експортиран на: ${new Date(data.exportDate).toLocaleString('bg-BG')}`);
  console.log(`📊 Файлове: ${data.totalFiles}`);
  console.log(`💾 Размер: ${Math.round(data.totalSize / 1024)}KB`);
  console.log('═'.repeat(50));
  
  const outputDir = 'airis-extracted';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of data.files) {
    try {
      const filePath = path.join(outputDir, file.path);
      const fileDir = path.dirname(filePath);
      
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, file.content, 'utf8');
      successCount++;
      console.log(`✅ ${file.path} (${Math.round(file.size / 1024)}KB)`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Грешка при ${file.path}: ${error.message}`);
    }
  }
  
  console.log('═'.repeat(50));
  console.log(`✅ Успешно: ${successCount} файла`);
  if (errorCount > 0) {
    console.log(`❌ Грешки: ${errorCount} файла`);
  }
  console.log(`📁 Извлечено в: ${outputDir}/`);
  console.log('═'.repeat(50));
  console.log('');
  console.log('📝 Следващи стъпки:');
  console.log(`   1. cd ${outputDir}`);
  console.log('   2. npm install');
  console.log('   3. npm run dev');
  console.log('');
  console.log('🚀 Готово! Приложението ще стартира на http://localhost:5173');
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node extract-project.js <export-file.json>');
  process.exit(1);
}

extractProject(args[0]);
