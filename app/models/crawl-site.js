import Ember from 'ember';
import Model from 'ember-data/model';
import ValidationEngine from 'ghost-admin/mixins/validation-engine';
import attr from 'ember-data/attr';
import boundOneWay from 'ghost-admin/utils/bound-one-way';
import moment from 'moment';
import {BLANK_DOC as BLANK_MOBILEDOC} from 'koenig-editor/components/koenig-editor';
import {belongsTo, hasMany} from 'ember-data/relationships';
import {computed, observer} from '@ember/object';
import {copy} from '@ember/object/internals';
import {equal, filterBy} from '@ember/object/computed';
import {isBlank} from '@ember/utils';
import {inject as service} from '@ember/service';

export default Model.extend(ValidationEngine, {
    config: service(),
    feature: service(),
    ghostPaths: service(),
    clock: service(),
    settings: service(),

    validationType: 'crawl-site',

    createdAtUTC: attr('moment-utc'),
    updatedAtUTC: attr('moment-utc'),
    queryRule: attr('string'),
    page: attr('boolean', {defaultValue: false}),
    status: attr('string', {defaultValue: 'open'}),
    title: attr('string', {defaultValue: ''}),
    resUrl: attr('string'),
    interval: attr('string'),

    primaryAuthor: computed('authors.[]', function () {
        return this.get('authors.firstObject');
    }),

    init() {
        this._super(...arguments);
    },

    scratch: null,
    titleScratch: null,

    // HACK: used for validation so that date/time can be validated based on
    // eventual status rather than current status
    statusScratch: null,

    // For use by date/time pickers - will be validated then converted to UTC
    // on save. Updated by an observer whenever publishedAtUTC changes.
    // Everything that revolves around publishedAtUTC only cares about the saved
    // value so this should be almost entirely internal
    publishedAtBlogDate: '',
    publishedAtBlogTime: '',

    customExcerptScratch: boundOneWay('customExcerpt'),
    codeinjectionFootScratch: boundOneWay('codeinjectionFoot'),
    codeinjectionHeadScratch: boundOneWay('codeinjectionHead'),
    metaDescriptionScratch: boundOneWay('metaDescription'),
    metaTitleScratch: boundOneWay('metaTitle'),
    ogDescriptionScratch: boundOneWay('ogDescription'),
    ogTitleScratch: boundOneWay('ogTitle'),
    twitterDescriptionScratch: boundOneWay('twitterDescription'),
    twitterTitleScratch: boundOneWay('twitterTitle'),

    isPublished: equal('status', 'published'),
    isDraft: equal('status', 'draft'),
    internalTags: filterBy('tags', 'isInternal', true),
    isScheduled: equal('status', 'scheduled'),

    absoluteUrl: computed('url', 'ghostPaths.url', 'config.blogUrl', function () {
        let blogUrl = this.get('config.blogUrl');
        let postUrl = this.get('url');
        return this.get('ghostPaths.url').join(blogUrl, postUrl);
    }),

    previewUrl: computed('uuid', 'ghostPaths.url', 'config.blogUrl', function () {
        let blogUrl = this.get('config.blogUrl');
        let uuid = this.get('uuid');
        // routeKeywords.preview: 'p'
        let previewKeyword = 'p';
        // New posts don't have a preview
        if (!uuid) {
            return '';
        }
        return this.get('ghostPaths.url').join(blogUrl, previewKeyword, uuid);
    }),

    // check every second to see if we're past the scheduled time
    // will only re-compute if this property is being observed elsewhere
    pastScheduledTime: computed('isScheduled', 'publishedAtUTC', 'clock.second', function () {
        if (this.get('isScheduled')) {
            let now = moment.utc();
            let publishedAtUTC = this.get('publishedAtUTC') || now;
            let pastScheduledTime = publishedAtUTC.diff(now, 'hours', true) < 0;

            // force a recompute
            this.get('clock.second');

            return pastScheduledTime;
        } else {
            return false;
        }
    })
});
