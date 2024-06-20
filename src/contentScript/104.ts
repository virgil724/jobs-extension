// Select elements
const titleElement = document.querySelector("#app > div > div.mobile > div.jobmobile-header.mb-3 > div.bg-white.p-4 > h1");
const jobTitle = titleElement ? titleElement.childNodes[0].textContent.trim() : '';

const pay = document.querySelector("#app > div > div.mobile > div.jobmobile-header.mb-3 > div.bg-white.p-4 > div > div.col.flex-1.text-primary.h3 > span.align-baseline")?.innerHTML;
const addr = document.querySelector("#app > div > div.mobile > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(3) > div.col.p-0.list-row__data > div > div > span:nth-child(1)")?.innerHTML;

const children = document.querySelector("#app > div > div.mobile > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(1) > div.col.p-0.list-row__data > div > div")?.children;
const workCata = [];

if (children) {
    for (let i = 0; i < children.length; i++) {
        const uElement = children[i].querySelector('u');
        if (uElement) {
            workCata.push(uElement.innerHTML);
        }
    }
}

const workType = document.querySelector("#app > div > div.mobile > div:nth-child(4) > div:nth-child(1) > div > div:nth-child(2) > div.col.p-0.list-row__data > div")?.innerHTML;
const jd = document.querySelector("#app > div > div.mobile > div:nth-child(4) > div:nth-child(2) > div.job-description-table.row > div.job-description.col-12 > p")?.innerHTML;

// Select the container that holds the job requirements
const container = document.querySelector("#app > div > div.mobile > div.dialog.container-fluid.bg-white.rounded.dialog-mobile.py-4.mb-3.job-requirement");

// Initialize an empty object to hold the requirements
const reqs = {};

// Function to extract text from an element
const extractText = element => element ? element.textContent.trim() : '';

// Extract each requirement with shorter English short names
reqs['exp'] = extractText(container.querySelector('div.job-requirement-table > div:nth-child(1) .col.p-0.list-row__data div'));
reqs['edu'] = extractText(container.querySelector('div.job-requirement-table > div:nth-child(2) .col.p-0.list-row__data div'));
reqs['maj'] = extractText(container.querySelector('div.job-requirement-table > div:nth-child(3) .col.p-0.list-row__data div'));
reqs['lang'] = extractText(container.querySelector('div.job-requirement-table > div:nth-child(4) .col.p-0.list-row__data div p'));
reqs['tool'] = extractText(container.querySelector('div.job-requirement-table > div:nth-child(5) .col.p-0.list-row__data div'));
reqs['skl'] = extractText(container.querySelector('div.job-requirement-table > div:nth-child(6) .col.p-0.list-row__data div'));
reqs['oth'] = extractText(container.querySelector('.job-requirement.col.is-ellipsis .list-row__data .job-requirement-table__maxheight p'));

// Compile the work detail object
const workDetail = {
    jobTitle,
    pay,
    addr,
    workType,
    workCata,
    jd,
    reqs
};

// Log the work detail object
console.log(workDetail);

chrome.runtime.sendMessage({
    type: "104",

    workDetail
})