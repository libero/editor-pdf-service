import { Server } from 'http';
import request from 'supertest';

const startJobMock = jest.fn();
jest.mock('./services/generate', () => () => ({
  startJob: startJobMock,
}));

describe('server', () => {
  let server: Server;
  beforeEach(() => {
    server = require('./index');
    startJobMock.mockReset();
  });
  afterEach(() => {
    server.close();
  });

  describe('/health', () => {
    it('responds to request', (done) => {
      request(server).get('/health').expect(200, done);
    });
  });

  describe('/generate/:id', () => {
    it('responds 200 when startJob successful', async () => {
      await request(server).post('/generate/someId').expect(200);
      expect(startJobMock).toBeCalledWith('someId');
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
});
