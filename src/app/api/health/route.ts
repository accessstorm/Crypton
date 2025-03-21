import { NextResponse } from 'next/server';

/**
 * Health check endpoint for monitoring
 * This helps Docker and other deployment tools check if the application is healthy
 */
export async function GET() {
  // Simple health check that doesn't depend on external services
  return NextResponse.json(
    {
      status: 'ok',
      time: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
    },
    { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    }
  );
} 