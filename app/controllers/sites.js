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
    
    init() {
        this._super(...arguments);
        this.set('newNavItem', NavigationItem.create({isNew: true}));
    },
    sites: alias('model'),

    actions: {
        save() {
            this.get('sites').save();
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
            siteItem.save();
            this.set('dirtyAttributes', true);
        },

        reset() {
            this.set('newNavItem', NavigationItem.create({isNew: true}));
        }
    },

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
