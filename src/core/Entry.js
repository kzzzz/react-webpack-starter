import mimeTypes from './mime-types';

export default class {
    constructor(harEntry, page) {
        "use strict";

        const startTime = new Date(harEntry.startedDateTime) - new Date(page.startedDateTime);

        const {
            time,
            request:{url, method},
            response:{
                content:{size, mimeType}
            },
            timings
        } = harEntry;


        this.request = {url, method};
        this.time = {
            start: startTime,
            total: time,
            details: timings
        };

        this.size = size;
        this.type = mimeTypes.identify(mimeType);
    }
}