var _ = require('lodash');

import Page from './Page';
import Entry from './Entry';

export default function (har) {
    "use strict";

    var pageMap = {};
    var pages = [];

    _.each(har.log.pages, p => {
        let page = new Page(p);
        pageMap[p.id] = page;

        pages.push(page);
    });

    _.each(har.log.entries, p => {
        let page = pageMap[p.pageref];
        let entry = new Entry(p, page);

        page.entries.push(entry);
    });

    return pages;
}