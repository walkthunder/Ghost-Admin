/* eslint-disable ghost/ember/alias-model-in-controller */
import $ from 'jquery';
import Controller from '@ember/controller';
import CrawlSiteItem from 'ghost-admin/models/crawl-site';
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

    newSiteItem: null,

    dirtyAttributes: false,
    
    init() {
        this._super(...arguments);
        this.set('newSiteItem', this.store.createRecord('crawl-site', {
            resUrl: 'https://google.com',
            queryRule: 'div'
        }));
    },
    sites: alias('model'),

    actions: {
        save() {
            this.get('sites').save();
        },

        addSiteItem() {
            let newSiteItem = this.get('newSiteItem');
            console.debug('[add site item] - ', this.sites, newSiteItem);
            newSiteItem.save();
        },

        updateSite(siteItem) {
            if (!siteItem) {
                return;
            }
            siteItem.save();
            this.set('dirtyAttributes', true);
        },

        reset() {
            this.set('newSiteItem', CrawlSiteItem.create({isNew: true}));
        }
    },

    addNewSiteItem() {
        let newSiteItem = this.get('newSiteItem');

        newSiteItem.set('isNew', false);
        console.debug('[add new site item - ]', newSiteItem);
        this.sites.pushObject(newSiteItem);
        this.sites.save();
        this.set('dirtyAttributes', true);
    }
});
