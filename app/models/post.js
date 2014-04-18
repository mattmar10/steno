'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    /**
 * Article Schema
 */
var PostSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    published:{
        type: Boolean,
        default: false
    },
    tags:{
    	type: [String]
    }
});

/**
 * Validations
 */
PostSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
PostSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('author', 'name username').exec(cb);
};

mongoose.model('Post', PostSchema);