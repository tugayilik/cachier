import Config from '../../src/config';
import Cachier from '../../src/cachier';
import Utils from '../../src/utils';

describe('Service Worker', () => {
    it('checks service worker path', () => {
        expect(Config.serviceWorkerPath).toBeTruthy();
    });
});

describe('Cachier Class', () => {
    it('checks cachier class is definable', () => {
        expect(typeof new Cachier()).toBe('object');
    });
});

describe('Events', () => {

    it('checks events are available in cachier class', () => {
        expect(typeof (new Cachier()).events).toBe('object');
    });

    it('checks core events are defined in cachier class', () => {
        const cachier = new Cachier();
        expect(typeof cachier.add === 'function' &&
            typeof cachier.get === 'function' &&
            typeof cachier.delete === 'function' &&
            typeof cachier.update === 'function' &&
            typeof cachier.clear === 'function' &&
            typeof cachier.initializeServiceWorker === 'function'
        ).toBe(true);
    });


});

describe('Utils', () => {

    it('checks if the version given by user is below|equal 0 makes it 1', () => {
        expect(Utils.adjustIndexedDbVersion(0)).toBe(1);
        expect(Utils.adjustIndexedDbVersion(0.2)).toBe(1);
        expect(Utils.adjustIndexedDbVersion(-1)).toBe(1);
        expect(Utils.adjustIndexedDbVersion(-1.2)).toBe(1);
    });

    it('checks if the version given by user is greater than 0 it equals itself', () => {
        expect(Utils.adjustIndexedDbVersion(2)).toBe(2);
    });


    it('checks if the version given by user is decimal, it rounds it up', () => {
        expect(Utils.adjustIndexedDbVersion(2.5)).toBe(3);
    });
});