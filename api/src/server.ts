console.log('🔧 Iniciando servidor...');
import app from '../src/app';
import { swaggerSpec } from '../src/swagger/swagger';
console.log('Swagger Spec:', JSON.stringify(swaggerSpec, null, 2));

app.listen(3000, () => {
  console.log('🚗 API rodando em http://localhost:3000');
  console.log('📚 Swagger disponível em http://localhost:3000/api-docs');
});