import fetch from 'node-fetch';
jest.mock('node-fetch');
import GenerateService from './generate';

describe('GenerateService', () => {
    it('initializes without error', () => {
        expect(() => GenerateService({})).not.toThrow();
    });
    beforeEach(() => {
        (fetch as unknown as jest.Mock).mockReset();
    });
    describe('startJob', () => {
        it('throws NotFound error if article not found', async () => {
            (fetch as unknown as jest.Mock).mockImplementationOnce(() => ({ status: 404 }));
            await expect(GenerateService({}).startJob('11111')).rejects.toThrow('NotFound');
        });
        it('doesn\t throw when article exists', async () => {
            (fetch as unknown as jest.Mock).mockImplementationOnce(() => ({ status: 200 }));
            await expect(GenerateService({}).startJob('11111')).resolves.toBeUndefined();
        });
    });
    describe('getJobStatus', () => {
        it('returns the message status from job status request response', async () => {
            (fetch as unknown as jest.Mock).mockImplementation(() => {
                return { json: () => ({ status: { message: { status: 'someStatusCode' } } }) };
            });
            await expect(GenerateService({}).getJobStatus('11111')).resolves.toBe('someStatusCode');
        });
        it('sends job status request with expected encodedform values', async () => {
            (fetch as unknown as jest.Mock).mockImplementation(() => {
                return { json: () => ({ status: { message: { status: 'someStatusCode' } } }) };
            });
            await GenerateService({
                generationJobStatusURL: 'jobstatusUrl',
            }).getJobStatus('11111');
            expect((fetch as unknown as jest.Mock).mock.calls[0][0]).toBe('jobstatusUrl');
            expect((fetch as unknown as jest.Mock).mock.calls[0][1].body).toBeInstanceOf(URLSearchParams);
            expect((fetch as unknown as jest.Mock).mock.calls[0][1].body.toString()).toBe('id=11111');
        });
    });
});
