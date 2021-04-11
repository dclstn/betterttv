import $ from 'jquery';
import settings from '../../settings';
import watcher from '../../watcher';
import domObserver from '../../observers/dom';

let removeCommunityHighlightsListener;

class HideCommunityHighlightsModule {
    constructor() {
        settings.add({
            id: 'hideCommunityHighlights',
            name: 'Hide Community Highlights',
            defaultValue: false,
            description: 'Hides the alerts above chat for hype trains, community chest, etc.'
        });

        settings.on('changed.hideCommunityHighlights', this.toggleCommunityHighlights);
        watcher.on('load', this.toggleCommunityHighlights);
    }

    toggleCommunityHighlights() {
        if (settings.get('hideCommunityHighlights')) {
            if (removeCommunityHighlightsListener) return;

            removeCommunityHighlightsListener = domObserver.on('.community-highlight-stack__card', (node, isConnected) => {
                if (!isConnected) return;
                const $node = $(node);
                if ($node.find('.channel-poll__more-icon').length > 0) return;
                $node.addClass('bttv-hide-community-highlights');
            });
            return;
        }

        if (!removeCommunityHighlightsListener) return;

        removeCommunityHighlightsListener();
        removeCommunityHighlightsListener = undefined;
        $('.community-highlight-stack__card').removeClass('bttv-hide-community-highlights');
    }
}

export default new HideCommunityHighlightsModule();
