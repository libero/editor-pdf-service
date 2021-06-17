import fetch from 'node-fetch';
jest.mock('node-fetch');
import GenerateService from './generate';

describe('GenerateService', () => {
  it('initializes without error', () => {
    expect(() => GenerateService({})).not.toThrow();
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
});
