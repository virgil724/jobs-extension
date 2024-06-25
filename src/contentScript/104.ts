export interface WorkDetail {
    type: string;
    coords: { lat: number; lng: number } | null;
    urlPath: string;
    jobTitle: string;
    pay: string;
    addr: string;
    workType: string;
    workCata: string[];
    jd: string;
    reqs: Record<string, string>;
}

interface Selectors {
    jobTitle: string;
    pay: string;
    addr: string;
    workCata: string;
    workType: string;
    jd: string;
    reqs: string;
}

// Function to extract text content from an element
function getTextContent(selector: string): string {
    const element = document.querySelector(selector);
    return element ? element.textContent?.trim() || '' : '';
}

// Function to extract work categories
function extractWorkCategories(selector: string): string[] {
    const container = document.querySelector(selector);
    if (!container) return [];

    return Array.from(container.querySelectorAll('u'))
        .map(el => el.textContent?.trim() || '')
        .filter(text => text);
}

// Function to extract requirements
function extractRequirements(containerSelector: string): Record<string, string> {
    const container = document.querySelector(containerSelector);
    if (!container) return {};

    const reqs: Record<string, string> = {};
    const rows = container.querySelectorAll('.list-row.row');

    rows.forEach(row => {
        const head = row.querySelector('.list-row__head h3');
        const data = row.querySelector('.list-row__data .t3');
        if (head && data) {
            const key = head.textContent?.trim() || '';
            const value = data.textContent?.trim() || '';
            reqs[key] = value;
        }
    });

    // Extract "其他條件" separately as it has a different structure
    const otherReqs = container.querySelector('.job-requirement.col.opened .job-requirement-table__data p');
    if (otherReqs) {
        reqs['其他條件'] = otherReqs.textContent?.trim() || '';
    }

    return reqs;
}

let selectors: Selectors;
// TODO: jobTitle 會多東西 XX/XX更新 全職...
if (window.innerWidth < 1024) {
    selectors = {
        jobTitle: "#app > div > div.mobile > div.jobmobile-header.mb-3 > div.bg-white.p-4 > h1",
        pay: "#app > div > div.mobile > div.jobmobile-header.mb-3 > div.bg-white.p-4 > div > div.col.flex-1.text-primary.h3 > span.align-baseline",
        addr: "#app > div > div.mobile > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(3) > div.col.p-0.list-row__data > div > div > span:nth-child(1)",
        workCata: "#app > div > div.mobile > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1) > div.col.p-0.list-row__data > div > div",
        workType: "#app > div > div.mobile > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(2) > div.col.p-0.list-row__data > div",
        jd: "#app > div > div.mobile > div:nth-child(4) > div:nth-child(2) > div.job-description-table.row > div.job-description.col-12 > p",
        reqs: ".dialog.container-fluid.bg-white.rounded.dialog-mobile.py-4.mb-3.job-requirement"
    };
} else {
    selectors = {
        jobTitle: 'h1[data-v-704cbba1]',
        pay: '.list-row__data .t3.mb-0 .text-primary.font-weight-bold',
        addr: '.job-address span',
        workCata: '.category-item',
        workType: '.job-description-table > div:nth-child(4) > .list-row__data',
        jd: '.job-description__content',
        reqs: '.dialog.container-fluid.bg-white.rounded.mb-4.pt-6.pb-6.job-requirement'
    };
}




const workDetail: WorkDetail = {
    type: '104',
    urlPath: window.location.pathname,
    coords: null,
    jobTitle: getTextContent(selectors.jobTitle),
    pay: getTextContent(selectors.pay),
    addr: getTextContent(selectors.addr),
    workType: getTextContent(selectors.workType),
    workCata: extractWorkCategories(selectors.workCata),
    jd: getTextContent(selectors.jd),
    reqs: extractRequirements(selectors.reqs)
};
chrome.runtime.sendMessage({ type: 'geocode', addr: workDetail.addr }, function (response) {
    if (response.coords) {
        workDetail.coords = response.coords;
    } else {
        console.error('Geocoding error:', response.error);
    }
    chrome.runtime.sendMessage({
        type: "saveData",
        workDetail
    }, function () {
        chrome.runtime.sendMessage({ type: "updateJob" })

    });
})


console.log(workDetail)


// Assuming chrome.runtime.sendMessage is available in your environment
// If not, you might need to add type definitions for it
