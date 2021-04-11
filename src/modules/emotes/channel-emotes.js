import watcher from '../../watcher';
import cdn from '../../utils/cdn';
import twitch from '../../utils/twitch';

import AbstractEmotes from './abstract-emotes';
import Emote from './emote';

const provider = {
    id: 'bttv-channel',
    displayName: 'BetterTTV Channel Emotes',
    badge: cdn.url('tags/developer.png')
};

class ChannelEmotes extends AbstractEmotes {
    constructor() {
        super();

        watcher.on('channel.updated', d => this.updateChannelEmotes(d));
    }

    get provider() {
        return provider;
    }

    updateChannelEmotes({channelEmotes, sharedEmotes}) {
        this.emotes.clear();

        const emotes = channelEmotes.concat(sharedEmotes);
        const currentChannel = twitch.getCurrentChannel();

        emotes.forEach(({id, user, code, imageType}) => (
            this.emotes.set(code, new Emote({
                id,
                provider: this.provider,
                channel: user || currentChannel,
                code,
                images: {
                    '1x': cdn.emoteUrl(id, '1x'),
                    '2x': cdn.emoteUrl(id, '2x'),
                    '4x': cdn.emoteUrl(id, '3x')
                },
                imageType
            }))
        ));

        setTimeout(() => watcher.emit('emotes.updated'), 0);
    }
}

export default new ChannelEmotes();
