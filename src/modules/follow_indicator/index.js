import settings from '../../settings';
import domObserver from '../../observers/dom';
import $ from 'jquery';
import twitch from '../../utils/twitch';
import watcher from '../../watcher';
import twitchAPI from '../../utils/twitch-api';
import moment from 'moment';


const USER_CARD_SELECTOR = 'div[data-a-target="about-panel"]';
const FOLLOW_INDICATOR_ID = 'bttv-follow-indicator';

const indicatorTemplate = `
    <div class='tw-align-center tw-strong' id=${FOLLOW_INDICATOR_ID}>
        <div>Follows you</div>
        <div class="follow-tooltip"></div>
    </div>
`;

let $followIndicator;
let removeUserCardListener;

class FollowIndicatorModule {
    constructor() {
        settings.add({
            id: 'followIndicator',
            name: 'Follow Indicator',
            defaultValue: false,
            description: 'Adds following you indicator inside user-card below video-player.'
        });
        settings.on('changed.followIndicator', value => value === true ? this.load() : this.unload());
        watcher.on('load.channel', () => this.load());
        watcher.on('load.chat', () => this.load());
    }

    load() {
        if (settings.get('followIndicator') === false) return;

        const currentChannel = twitch.getCurrentChannel();
        const currentUser    = twitch.getCurrentUser();
        if (!currentUser || !currentChannel) return;

        if (currentChannel.id === currentUser.id) return;

        if (!$followIndicator) {
            $followIndicator = $(indicatorTemplate);
        }

        removeUserCardListener = domObserver.on('.social-media-space', (node, isConnected) => {
            if (!isConnected || node.getAttribute('data-a-target') !== 'about-panel') return;
            this.embedIndicator();
        });

        this.updateFollowingIndicatorState(currentUser.id, currentChannel.id);
    }

    embedIndicator() {
        if ($(`#${FOLLOW_INDICATOR_ID}`).length) return;
        const $usercard = $(USER_CARD_SELECTOR).find('.social-media-space--content').find('.tw-pd-1');
        const $followers = $usercard.find('.tw-align-center');
        $followIndicator.insertBefore($followers);
    }

    updateFollowingIndicatorState(userId, channelId) {
        return twitchAPI.get(`users/${channelId}/follows/channels/${userId}`)
            .then(({created_at: createdAt}) => {
                const since = moment(createdAt);
                $('.follow-tooltip').text(`Since ${since.fromNow()}.`);
                $followIndicator.show();
            })
            .catch(() => {
                $followIndicator.hide();
            });
    }

    unload() {
        removeUserCardListener && removeUserCardListener();
        $followIndicator && $followIndicator.remove();
    }
}

export default new FollowIndicatorModule();

