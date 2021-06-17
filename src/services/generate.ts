import fetch from 'node-fetch';

interface GenerateService {
    startJob: (id: string) => void;
}

export default (config: Record<string, unknown>): GenerateService => ({
    startJob: async (id: string) => {
        const response = await fetch(config['articleStorePath'] + id, { method: 'HEAD' });
        if (response.status === 404) {
            throw new Error('NotFound');
        }
    },
});
