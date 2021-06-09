import { Server } from 'http';
import request from 'supertest';

describe('server', () => {
    let server: Server;
    beforeEach(() => {
        server = require('./index');
    });
    afterEach(() => {
        server.close();
    });
    it('responds to /health request', (done) => {
        request(server).get('/health').expect(200, done);
    });
});
