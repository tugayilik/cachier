import Cachier from '@@/cachier';
import Events from '@@/events';

describe('src/cachier', () => {
    describe('constructor', () => {
        it('should instantiate new Cachier class', () => {
            const initializeServiceWorkerSpy = jest.spyOn(Cachier.prototype, 'initializeServiceWorker');
            const cachier = new Cachier();

            expect(cachier).toBeInstanceOf(Cachier);
            expect(initializeServiceWorkerSpy).toBeCalled();

            initializeServiceWorkerSpy.mockRestore();
        });
    });

    describe('add', () => {
        it('should call event\'s add method', () => {
            const eventsAddSpy = jest.spyOn(Events.prototype, 'add');
            const cachier = new Cachier();

            cachier.add(['/test/style.css']);

            expect(eventsAddSpy).toBeCalledWith(['/test/style.css'], expect.any(Function));
        });

        it('should call event\'s add method', () => {
            const eventsAddSpy = jest.spyOn(Events.prototype, 'add');
            const cachier = new Cachier();

            cachier.add(['/test/style.css']);

            expect(eventsAddSpy).toBeCalledWith(['/test/style.css'], expect.any(Function));
        });
    });

    describe('get', () => {
        it('should call event\'s get method', () => {
            const eventsGetSpy = jest.spyOn(Events.prototype, 'get');
            const cachier = new Cachier();

            cachier.get('/test/style.css', () => {});

            expect(eventsGetSpy).toBeCalledWith('/test/style.css', expect.any(Function));
            eventsGetSpy.mockReset();
        });

        it('should call event\'s get method', () => {
            const eventsGetSpy = jest.spyOn(Events.prototype, 'get');
            const cachier = new Cachier();

            cachier.get(() => {});

            expect(eventsGetSpy).toBeCalledWith(expect.any(Function), undefined);
            eventsGetSpy.mockReset();
        });
    });

    describe('delete', function () {
        it('should call event\'s delete method', function () {
            const eventDeleteSpy = jest.spyOn(Events.prototype, 'delete');
            const cachier = new Cachier();

            cachier.delete(['/test/style.css'], () => {});

            expect(eventDeleteSpy).toBeCalledWith(['/test/style.css'], expect.any(Function));
            eventDeleteSpy.mockReset();
        });
    });

    describe('update', function () {
        it('should call event\'s update method', function () {
            const eventUpdateSpy = jest.spyOn(Events.prototype, 'update');
            const cachier = new Cachier();

            cachier.update(['/test/style.css'], () => {});

            expect(eventUpdateSpy).toBeCalledWith(['/test/style.css'], expect.any(Function));
            eventUpdateSpy.mockReset();
        });
    });

    describe('clear', function () {
        it('should call event\'s clear method', function () {
            const eventClearSpy = jest.spyOn(Events.prototype, 'clear');
            const cachier = new Cachier();

            cachier.clear(() => {});

            expect(eventClearSpy).toBeCalledWith(expect.any(Function));
            eventClearSpy.mockReset();
        });
    });

    describe('initializeServiceWorker', function () {
        it('should call event\'s initializeServiceWorker method', function () {
            const initializeServiceWorkerSpy = jest.spyOn(Events.prototype, 'initializeServiceWorker');
            const cachier = new Cachier();

            cachier.initializeServiceWorker();

            expect(initializeServiceWorkerSpy).toBeCalled();
            initializeServiceWorkerSpy.mockReset();
        });
    });
});
