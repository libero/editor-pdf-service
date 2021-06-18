import fetch from 'node-fetch';

interface GenerateService {
    startJob: (id: string) => Promise<string>;
}

type StartGenerationJobResponseBody = {
    status: {
        code: number;
        message: string;
    };
    message: {
        jobid: string;
    };
};

export default (config: Record<string, unknown>): GenerateService => ({
    startJob: async (id: string): Promise<string> => {
        const articleResponse = await fetch(config['articleStorePath'] + id, { method: 'HEAD' });
        if (articleResponse.status === 404) {
            throw new Error('NotFound');
        }

        const params = new URLSearchParams();
        // TODO: We probably want to make more of these options configurable
        params.append('client', 'elife-libero');
        params.append('id', `elife.${id}`);
        params.append('idType', 'doi');
        params.append('processType', 'InDesignSetter');
        params.append('project', 'elife-libero');
        params.append('proof', 'online');
        params.append('proofingVersion', 'v2.0');
        params.append('siteName', `${config['generationJobResourcesPath']}${id}`);
        params.append('proofingEngine', 'InDesignSetter');
        params.append('apiKey', `${config['generaionJobApiKey']}`);
        // OPTIONAL - omitting this generates regular pdf
        // params.append('pdfType', 'figure')

        const startJobResponse = await fetch(config['startGenerationJobURL'] as string, {
            method: 'POST',
            body: params,
        });

        const body: StartGenerationJobResponseBody = await startJobResponse.json();

        if (body.status.code === 200) {
            return body.message.jobid;
        }

        throw new Error('Start generation job failed - code: ' + body.status.code + ' message: ' + body.status.message);
    },
});
