let stateHolder = new WeakMap();

export default class StateManager {

    static set (action, event) {
        stateHolder.set(this, {
            action,
            state: {
                error: event.error,
                message: event.message
            }
        });

        // Prevent causing error on legacy browsers
        if (typeof document.dispatchEvent === 'function') {
            document.dispatchEvent(new CustomEvent('stateChange', { 'detail': this.get() }));
        }
    }

    static get () {
        return stateHolder.get(this);
    }
}