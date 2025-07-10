const fs = require('fs');
const path = require('path');

// Функция для замены переменных в HTML файлах
function replaceEnvVarsInHtml(envVars) {
  const htmlFiles = [
    'public/index.html',
    'index.html'
  ];

  htmlFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Заменяем переменные
      content = content.replace(/База платежей SafePay/g, envVars.APP_DISPLAY_NAME);
      content = content.replace(/SafePay/g, envVars.APP_NAME);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  });
}

// Функция для обновления manifest.json
function updateManifest(envVars) {
  const manifestPath = 'public/manifest.json';
  
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    manifest.short_name = envVars.APP_DISPLAY_NAME;
    manifest.name = envVars.APP_DISPLAY_NAME;
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Updated ${manifestPath}`);
  }
}

// Функция для обновления package.json
function updatePackageJson(envVars) {
  const packagePath = 'package.json';
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Обновляем имя пакета
    const newPackageName = `backoffice.${envVars.APP_DOMAIN}`;
    packageJson.name = newPackageName;
    
    // Обновляем зависимости если есть
    if (packageJson.dependencies && packageJson.dependencies['backoffice.safepay.kg']) {
      packageJson.dependencies[newPackageName] = packageJson.dependencies['backoffice.safepay.kg'];
      delete packageJson.dependencies['backoffice.safepay.kg'];
    }
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log(`Updated ${packagePath}`);
  }
}

// Основная функция
function main() {
  const envFile = process.argv[2] || '.env';
  
  if (!fs.existsSync(envFile)) {
    console.error(`Environment file ${envFile} not found`);
    process.exit(1);
  }
  
  // Читаем переменные окружения
  const envContent = fs.readFileSync(envFile, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^(\w+)=(.*)$/);
    if (match) {
      envVars[match[1]] = match[2].trim();
    }
  });
  
  console.log('Environment variables loaded:', envVars);
  
  // Обновляем файлы
  replaceEnvVarsInHtml(envVars);
  updateManifest(envVars);
  updatePackageJson(envVars);
  
  console.log('All files updated successfully!');
}

if (require.main === module) {
  main();
}

module.exports = { replaceEnvVarsInHtml, updateManifest, updatePackageJson }; 