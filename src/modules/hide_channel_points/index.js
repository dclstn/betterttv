import $ from 'jquery';
import settings from '../../settings';

class HideChannelPointsModule {
    constructor() {
        settings.add({
            id: 'hideChannelPoints',
            name: 'Hide Channel Points',
            defaultValue: false,
            description: 'Hides channel points from the chat UI to reduce clutter'
        });
        settings.on('changed.hideChannelPoints', () => this.load());
        this.load();
    }

    load() {
        $('body').toggleClass('bttv-hide-channel-points', settings.get('hideChannelPoints'));
    }
}

export default new HideChannelPointsModule();
