import $ from 'jquery';
import settings from '../../settings';
import watcher from '../../watcher';

class HidePrimePromotionsModule {
    constructor() {
        settings.add({
            id: 'hidePrimePromotions',
            name: 'Hide Prime Promotions',
            defaultValue: false,
            description: 'Hides Twitch Prime loot notices, like the ones in the sidebar'
        });

        settings.on('changed.hidePrimePromotions', this.togglePrimePromotions);
        watcher.on('load', this.togglePrimePromotions);
    }

    togglePrimePromotions() {
        $('body').toggleClass(
            'bttv-hide-prime-promotions',
            settings.get('hidePrimePromotions')
        );
    }
}

export default new HidePrimePromotionsModule();
