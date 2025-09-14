function generateSlug(name) {
    return (
        name.toLowerCase()
            .replace(/\s+/g,'-')
            .replace(/[^a-z0-9-]/g, '')
            + '-' +
            Math.random().toString(36).substring(2,6)
    );
}

