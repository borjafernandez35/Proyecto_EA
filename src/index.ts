import app from './app';
import { startServer } from './server';

export async function main() {
    startServer();
    await app.listen(app.get('port'));
    console.log('Server on port', app.get('port'));
}

main();
