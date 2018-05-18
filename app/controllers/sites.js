/* eslint-disable ghost/ember/alias-model-in-controller */
import $ from 'jquery';
import Controller from '@ember/controller';
import NavigationItem from 'ghost-admin/models/navigation-item';
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

    newNavItem: null,

    dirtyAttributes: false,
    
    themes: null,
    themeToDelete: null,
    
    init() {
        this._super(...arguments);
        this.set('newNavItem', NavigationItem.create({isNew: true}));
    },
    sites: alias('model'),
    showDeleteThemeModal: notEmpty('themeToDelete'),

    blogUrl: computed('config.blogUrl', function () {
        let url = this.get('config.blogUrl');

        return url.slice(-1) !== '/' ? `${url}/` : url;
    }),

    actions: {
        save() {
            this.get('save').perform();
        },

        addNavItem() {
            let newNavItem = this.get('newNavItem');

            // If the url sent through is blank (user never edited the url)
            if (newNavItem.get('url') === '') {
                newNavItem.set('url', '/');
            }

            return newNavItem.validate().then(() => {
                this.addNewNavItem();
            });
        },

        deleteNavItem(item) {
            if (!item) {
                return;
            }

            let navItems = this.get('settings.navigation');

            navItems.removeObject(item);
            this.set('dirtyAttributes', true);
        },

        updateSite(siteItem) {
            if (!siteItem) {
                return;
            }
            console.log('---site item-----', siteItem);          
        },

        updateLabel(label, navItem) {
            if (!navItem) {
                return;
            }

            navItem.set('label', label);
            this.set('dirtyAttributes', true);
        },

        updateUrl(url, navItem) {
            if (!navItem) {
                return;
            }

            navItem.set('url', url);
            this.set('dirtyAttributes', true);
        },

        reset() {
            this.set('newNavItem', NavigationItem.create({isNew: true}));
        }
    },

    save: task(function* () {
        let navItems = this.get('settings.navigation');
        let newNavItem = this.get('newNavItem');
        let notifications = this.get('notifications');
        let validationPromises = [];

        if (!newNavItem.get('isBlank')) {
            validationPromises.pushObject(this.send('addNavItem'));
        }

        navItems.map((item) => {
            validationPromises.pushObject(item.validate());
        });

        try {
            yield RSVP.all(validationPromises);
            this.set('dirtyAttributes', false);
            return yield this.get('settings').save();
        } catch (error) {
            if (error) {
                notifications.showAPIError(error);
                throw error;
            }
        }
    }),

    addNewNavItem() {
        let navItems = this.get('settings.navigation');
        let newNavItem = this.get('newNavItem');

        newNavItem.set('isNew', false);
        navItems.pushObject(newNavItem);
        this.set('dirtyAttributes', true);
        this.set('newNavItem', NavigationItem.create({isNew: true}));
        $('.gh-blognav-line:last input:first').focus();
    }
});
