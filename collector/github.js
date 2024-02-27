import axios from 'axios';
import core from '@actions/core';

// create new web client
const client = axios.create({
    headers: { 'User-Agent': 'GoXLR Utility Winget Publisher / 1.0.0' },
    baseURL: "https://api.github.com"
});

// fetch latest github release
const releaseResp = await client.get("/repos/GoXLR-on-Linux/goxlr-utility/releases/latest");
const latestVersion = releaseResp.data.tag_name.replace('v', '');
const installerUrl = releaseResp.data.assets.find(a => a.name === `goxlr-utility-${latestVersion}.exe`)?.browser_download_url;

// check if version is up-to-date
const wingetResp = await client.get(`/repos/microsoft/winget-pkgs/contents/manifests/g/GoXLR-on-Linux/GoXLR-Utility/v${latestVersion}`).catch(() => null);
const isPublished = wingetResp === null ? false : wingetResp.status !== 404;

// export results for actions workflow
core.setOutput('latestVersion', latestVersion);
core.setOutput('installerUrl', installerUrl);
core.setOutput('isPublished', isPublished);

// print to log for debugging
console.log(`Latest Version:`.padEnd(15), latestVersion)
console.log(`Installer URL:`.padEnd(15), installerUrl)
console.log(`is Published:`.padEnd(15), isPublished)