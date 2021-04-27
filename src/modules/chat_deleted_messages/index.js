import $ from 'jquery';
import watcher from '../../watcher.js';
import twitch from '../../utils/twitch.js';
import settings from '../../settings.js';

const CHAT_LINE_SELECTOR = '.chat-line__message';
const CHAT_LINE_LINK_SELECTOR = 'a.link-fragment';
const CHAT_LINE_CLIP_CARD_SELECTOR = '.chat-card__link';
const CHAT_LINE_DELETED_CLASS = 'bttv-chat-line-deleted';

function findAllUserMessages(name) {
  return Array.from(document.querySelectorAll(CHAT_LINE_SELECTOR)).filter((node) => {
    const message = twitch.getChatMessageObject(node);
    if (!message) {
      return false;
    }
    if (!$(node).is(':visible')) {
      return false;
    }
    if (node.classList.contains(CHAT_LINE_DELETED_CLASS)) {
      return false;
    }
    return message.user.userLogin === name;
  });
}

class ChatDeletedMessagesModule {
  constructor() {
    settings.add({
      id: 'deletedMessages',
      type: 5,
      category: 'chat',
      options: {
        choices: ['Default', 'Remove <message deleted>', 'Keep Original Message'],
      },
      name: 'Deleted Messages',
      defaultValue: 0,
      description: 'What should happen when a message is deleted',
    });

    watcher.on('chat.message.handler', (message) => {
      this.handleMessage(message);
    });
  }

  handleMessage({message, preventDefault}) {
    switch (message.type) {
      case twitch.TMIActionTypes.CLEAR_CHAT:
        twitch.sendChatAdminMessage('Chat was cleared by a moderator (Prevented by BetterTTV)');
        preventDefault();
        break;
      case twitch.TMIActionTypes.MODERATION:
        if (this.handleDelete(message.userLogin || message.user.userLogin)) {
          preventDefault();
          // we still want to render moderation messages
          const chatBuffer = twitch.getChatBuffer();
          if (chatBuffer) {
            chatBuffer.state.messages.push(message);
            chatBuffer.onBufferUpdate();
          }
        }
        break;
      default:
        break;
    }
  }

  handleDelete(name) {
    const value = settings.get('deletedMessages');
    if (value === 0) return;
    const messages = findAllUserMessages(name);
    messages.forEach((message) => {
      const $message = $(message);
      if (value === 1) {
        $message.hide();
      } else {
        $message.toggleClass(CHAT_LINE_DELETED_CLASS, true);
        /* eslint-disable-next-line func-names */
        $message.find(CHAT_LINE_LINK_SELECTOR).each(function () {
          const $link = $(this);
          $link.removeAttr('href');
        });
        $message.find(CHAT_LINE_CLIP_CARD_SELECTOR).remove();
      }
    });
    return true;
  }
}

export default new ChatDeletedMessagesModule();
