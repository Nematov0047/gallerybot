const {InlineQueryResultBuilder} = require("grammy");
const Gallery = require("../models/gallery.model");
const escapeStringRegexp = require("./escape-string-regexp");

async function inlinequery(ctx) {
    const query = ctx.inlineQuery.query;
    const user_id = ctx.inlineQuery.from.id;
    let offset = ctx.inlineQuery.offset || 0;
    let photos;
    if (query.trim().length === 0) {
        photos = await Gallery.find({user_id: user_id}).skip(offset*50).limit(50);
    } else {
        photos = await Gallery.find({user_id: user_id, tags: {$regex: escapeStringRegexp(query), $options: "i"}}).skip(offset*50).limit(50);
    }
    
    let results = [];
    photos.map(photo => {
        results.push(InlineQueryResultBuilder.photoCached(photo._id, photo.file_id));
    })
    if (results.length === 0) {
        offset = "";
    } else {
        offset++;
    }

    await ctx.answerInlineQuery(results, {cache_time: 15, next_offset: offset});

}

module.exports = inlinequery;
