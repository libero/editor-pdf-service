import { Server } from 'http';
import request from 'supertest';

const startJobMock = jest.fn();
const getJobStatusMock = jest.fn();
jest.mock('./services/generate', () => () => ({
    startJob: startJobMock,
    getJobStatus: getJobStatusMock,
}));

describe('server', () => {
    let server: Server;
    beforeEach(() => {
        server = require('./index');
        startJobMock.mockReset();
        getJobStatusMock.mockReset();
    });
    afterEach(() => {
        server.close();
    });

    describe('GET /health', () => {
        it('responds to request', (done) => {
            request(server).get('/health').expect(200, done);
        });
    });

    describe('/generate/:id', () => {
        it('responds 200 when startJob successful and returns jobid', async () => {
            startJobMock.mockImplementation(() => 'someJobid');
            const response = await request(server).post('/generate/someId').expect(200);
            expect(startJobMock).toBeCalledWith('someId');
            expect(response.text).toBe('someJobid');
        });
        it('responds 404 when startJob throws NotFound', async () => {
            startJobMock.mockImplementation(() => {
                throw new Error('NotFound');
            });
            await request(server).post('/generate/someId').expect(404);
        });
        it('responds 500 when startJob throws other errors', async () => {
            startJobMock.mockImplementation(() => {
                throw new Error('SomeOtherError');
            });
            await request(server).post('/generate/someId').expect(500);
        });
    });

    describe('GET /status/:jobId', () => {
        it('responds 200 when getJobStatus successful and returns status', async () => {
            getJobStatusMock.mockImplementation(() => 'completed');
            const response = await request(server).get('/status/someId').expect(200);
            expect(getJobStatusMock).toBeCalledWith('someId');
            expect(response.text).toBe('completed');
        });
        it('responds 500 when getJobStatus throws', async () => {
            getJobStatusMock.mockImplementation(() => {
                throw new Error('SomeError');
            });
            await request(server).get('/status/someId').expect(500);
        });
    });
});
