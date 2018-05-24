/* eslint-disable ghost/ember/alias-model-in-controller */
import $ from 'jquery';
import Controller from '@ember/controller';
import CrawllinkItem from 'ghost-admin/models/crawllink';
import RSVP from 'rsvp';
import {computed} from '@ember/object';
import {isEmpty} from '@ember/utils';
import {isThemeValidationError} from 'ghost-admin/services/ajax';
import {alias, notEmpty} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import {task} from 'ember-concurrency';

export default Controller.extend({
    config: service(),
    ghostPaths: service(),
    notifications: service(),
    session: service(),
    settings: service(),

    newLinkItem: null,

    dirtyAttributes: false,
    
    init() {
        this._super(...arguments);
        this.set('newLinkItem', this.store.createRecord('crawllink', {
            isNew: true
        }));
    },
    links: alias('model'),

    actions: {
        save() {
            this.get('links').save();
        },

        addLinkItem() {
            let newLinkItem = this.get('newLinkItem');
            console.debug('[add link item] - ', this.links, newLinkItem);
            newLinkItem.save();
            this.addnewLinkItem();
        },

        updateLink(linkItem) {
            if (!linkItem) {
                return;
            }
            linkItem.save();
            this.set('dirtyAttributes', true);
        },

        reset() {
            this.set('newLinkItem', CrawllinkItem.create({isNew: true}));
        }
    },

    addnewLinkItem() {
        let newLinkItem = this.get('newLinkItem');

        newLinkItem.set('isNew', false);
        console.debug('[add new link item - ]', newLinkItem);
        this.links.pushObject(newLinkItem);
        this.set('newLinkItem', this.store.createRecord('crawllink', {
            isNew: true
        }));
    }
});
