// Minimal server function - application runs entirely client-side
export default function handler(req: Request): Response {
  return new Response(
    JSON.stringify({ 
      message: 'TruthLens runs entirely client-side. No server functions needed.',
      status: 'offline'
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}