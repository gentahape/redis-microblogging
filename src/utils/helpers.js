function extractHashtags(text) {
    const regex = /#(\w+)/g;
    const matches = text.match(regex);
    return matches ? [...new Set(matches.map(tag => tag.toLowerCase()))] : [];
}

module.exports = {
    extractHashtags,
}