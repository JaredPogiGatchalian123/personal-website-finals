import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Set Global Prefix
  // This makes your endpoints look like: /api/guestbook
  // This is helpful for Vercel routing
  app.setGlobalPrefix('api');

  // 2. Updated CORS Configuration
  // This allows your React frontend (Vite) to communicate with the Nest.js backend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://your-vercel-domain.vercel.app'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  console.log('Backend starting on http://localhost:3000');
  
  // 3. Debugging Logs
  // Ensuring your environment variables are being read correctly for Supabase
  console.log('Supabase URL:', process.env.SUPABASE_URL ? 'LOADED' : 'NOT_FOUND');
  console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'LOADED' : 'NOT_FOUND');

  await app.listen(3000);
}
bootstrap();