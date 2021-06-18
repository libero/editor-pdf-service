import fetch from 'node-fetch';

interface GenerateService {
    startJob: (id: string) => void;
    getJobStatus: (jobId: string) => Promise<string>;
}

type GenerationJobStatusResponseBody = {
    status: {
        code: number;
        message: {
            status: string;
        };
    };
};

export default (config: Record<string, unknown>): GenerateService => ({
    startJob: async (id: string) => {
        const response = await fetch(config['articleStorePath'] + id, { method: 'HEAD' });
        if (response.status === 404) {
            throw new Error('NotFound');
        }
    },
    getJobStatus: async (jobId: string) => {
        const params = new URLSearchParams();
        params.append('id', jobId);
        const jobStatusResponse = await fetch(config['generationJobStatusURL'] as string, {
            method: 'POST',
            body: params,
        });
        const body: GenerationJobStatusResponseBody = await jobStatusResponse.json();
        return body.status.message.status;
    },
});
