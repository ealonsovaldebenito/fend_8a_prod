{
    "compilerOptions": {
      "target": "ES6",                     // Define la versión de JavaScript
      "module": "commonjs",                 // Módulo común en Node.js
      "jsx": "react",                       // Para proyectos con React
      "esModuleInterop": true,              // Mejor interoperabilidad con ES6
      "moduleResolution": "node",           // Resolución de módulos estilo Node.js
      "forceConsistentCasingInFileNames": true, // Enforce casing consistency
      "strict": true,                       // Habilita las verificaciones estrictas de TypeScript
      "skipLibCheck": true                  // Omite la verificación de bibliotecas de tipo
    },
    "include": ["src/**/*"],                // Incluye todos los archivos en el directorio `src`
    "exclude": ["node_modules"]             // Excluye los módulos de Node.js
  }
  