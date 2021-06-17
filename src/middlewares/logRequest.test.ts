import { Response, Request } from 'express';
import logRequest from './logRequest';

describe('logRequest', () => {
    const originalConsole = console;
    const RealDate = Date.now;

    afterAll(() => {
        console = originalConsole;
        global.Date.now = RealDate;
    });

    it('logs output as expected', () => {
        console.log = jest.fn();
        global.Date.now = jest.fn(() => new Date(1609495200000).getTime());
        expect(console.log).not.toBeCalled();
        const mockRequest = {
            method: 'SOME_METHOD',
            path: 'SOME_PATH',
        } as Request;
        logRequest(mockRequest, null as unknown as Response, () => {});
        expect(console.log).toBeCalledWith('1609495200000 : Processing SOME_METHOD for SOME_PATH');
    });

    it('calls next callback', () => {
        const mockNextCallback = jest.fn();
        logRequest({} as Request, null as unknown as Response, mockNextCallback);
        expect(mockNextCallback).toBeCalled();
    });
});
