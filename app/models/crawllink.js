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
    isNew: false,
    validationType: 'crawlsite',

    createdAtUTC: attr('moment-utc'),
    updatedAtUTC: attr('moment-utc'),
    crawlsiteId: attr('string'),
    postId: attr('string'),
    queryRule: attr('string'),
    status: attr('string', {defaultValue: 'pending'}),
    page: attr('boolean', {defaultValue: false})
});
