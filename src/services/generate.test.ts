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
        beforeEach(() => {
            (fetch as unknown as jest.Mock).mockReset();
        });
        it('throws NotFound error if article not found', async () => {
            (fetch as unknown as jest.Mock).mockImplementation((fetchURL: string) => {
                if (fetchURL === 'someUrl/11111') return { status: 404 };
                return { json: () => ({ status: { code: 200 }, message: { jobid: 'someJobId' } }) };
            });
            await expect(GenerateService({ articleStorePath: 'someUrl/' }).startJob('11111')).rejects.toThrow(
                'NotFound',
            );
        });
        it('doesn\t throw when article exists and returns jobid', async () => {
            (fetch as unknown as jest.Mock).mockImplementation((fetchURL: string) => {
                if (fetchURL === 'someUrl/11111') return { status: 200 };
                return { json: () => ({ status: { code: 200 }, message: { jobid: 'someJobId' } }) };
            });
            await expect(GenerateService({ articleStorePath: 'someUrl/' }).startJob('11111')).resolves.toBe(
                'someJobId',
            );
        });
        it("throws when job start request doesn't return 200 status", async () => {
            (fetch as unknown as jest.Mock).mockImplementation((fetchURL: string) => {
                if (fetchURL === 'someUrl/11111') return { status: 200 };
                return { json: () => ({ status: { code: 500, message: 'Something went worng!' } }) };
            });
            await expect(GenerateService({ articleStorePath: 'someUrl/' }).startJob('11111')).rejects.toThrow(
                'Start generation job failed - code: 500 message: Something went worng!',
            );
        });
        it('sends start job request with expected encodedform values', async () => {
            (fetch as unknown as jest.Mock).mockImplementation((fetchURL: string) => {
                if (fetchURL === 'someUrl/11111') return { status: 200 };
                return { json: () => ({ status: { code: 200 }, message: { jobid: 'someJobId' } }) };
            });
            await GenerateService({
                articleStorePath: 'someUrl/',
                generationJobResourcesPath: 'generationJobResourcesPath/',
                generaionJobApiKey: 'someApiKey',
            }).startJob('11111');
            expect((fetch as unknown as jest.Mock).mock.calls[1][1].body).toBeInstanceOf(URLSearchParams);
            expect((fetch as unknown as jest.Mock).mock.calls[1][1].body.toString()).toBe(
                'client=elife-libero&id=elife.11111&idType=doi&processType=InDesignSetter&project=elife-libero&proof=online&proofingVersion=v2.0&siteName=generationJobResourcesPath%2F11111&proofingEngine=InDesignSetter&apiKey=someApiKey',
            );
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
