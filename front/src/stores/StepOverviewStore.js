import WatchableStore from 'watchable-store';

const StepOverviewStore = () => {
    const store = WatchableStore({
        action: '',
        isOpened: false,
        step: null
    });

    store.isOpened = store.data.isOpened;

    store.open = step => {
        store.data = {
            action: 'OPEN',
            isOpened: true,
            step
        };
    };

    store.close = () => {
        store.data = {
            action: 'CLOSE',
            isOpened: true,
            step: null
        };
    };


    return store;
};

export default StepOverviewStore();
