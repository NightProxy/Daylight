import { exec } from "child_process";
import * as fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { select, Separator } from '@inquirer/prompts';
import { exit } from "process";
import createRammerhead from "rammerhead/src/server/index.js";
import express from "express";
import { fileURLToPath } from "url"
import http from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "./node_modules/@mercuryworkshop/epoxy-transport/lib/index";
//the normal library does not have type definitions, so we're using a fork (mine)
//i wasn't able to just use @mercuryworkshop/epoxy-transport because for some reason it wasn't looking in the node modules, but was looking through npm or something
import { libcurlPath } from "@mercuryworkshop/libcurl-transport/";
import { bareModulePath } from "./node_modules/@mercuryworkshop/bare-as-module3/lib/index"
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { meteorPath } from "meteorproxy"
import wisp from "wisp-server-node";
import net from "node:net"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let updateInProgress = false;
let updateCompleted = false;
let rebuildInProgress = false;
let rebuildCompleted = false;

console.log(chalk.blue("Starting Daylight"));

function handleTermination(signal: string) {
    if (updateInProgress) {
        console.log(chalk.red(`Cannot terminate now. Daylight is currently updating. Termination of the script now will brick Daylight. The only way to fix a "bricking" of Daylight, is to completely download it again, and make a new instance.`));
    } else {
        console.log(chalk.blue(`Received ${signal}. Exiting now.`));
        process.exit();
    }
}

process.on("SIGINT", () => handleTermination("SIGINT"));
process.on("SIGTERM", () => handleTermination("SIGTERM"));

const root = [
    "index.html",
];
const icons = [
    "assets/icons/lucide.eot",
    "assets/icons/lucide.svg",
    "assets/icons/lucide.ttf",
    "assets/icons/lucide.woff",
    "assets/icons/lucide.woff2",
];
const js = [
    "assets/js/index.js",
    "assets/js/index.js.map",
];
const css = [
    "assets/css/index.css",
];
const fonts = [
    "fonts/horizon_outlined.otf",
    "fonts/horizon.otf",
];
const img = [
    "img/favicon_dark.png",
    "img/favicon_light.png",
    "img/bg/bgDark.png",
    "img/bg/bgLight.png"
];

function checkFiles(files: string[], baseDir: string) {
    let allFilesExist = true;
    files.forEach(file => {
        const filePath = path.join(baseDir, file);
        if (!fs.existsSync(filePath)) {
            allFilesExist = false;
            console.error(chalk.red(`Specific file missing: ${filePath}`));
        } else {
            console.log(chalk.green(`Verified: ${filePath}`));
        }
    });
    return allFilesExist;
}

function rebuildAndCheckIntegrity() {
    const spinner = ora("Rebuilding Daylight...").start();
    rebuildInProgress = true;

    const buildProcess = new Promise<void>((resolve, reject) => {
        fs.rm("./dist", { recursive: true, force: true }, (err) => {
            if (err) return reject(err);
            exec("npm run build", (error, stdout, stderr) => {
                if (error) return reject(error);
                console.log(stdout);
                if (stderr) console.error(stderr);
                resolve();
                rebuildCompleted = true;
            });
        });
    });

    async function spinnerLoop() {
        while (rebuildInProgress && !rebuildCompleted) {
            spinner.text = chalk.blue("Rebuilding Daylight...");
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        spinner.succeed("Rebuild and verification complete.");
        startServer();
    }

    spinnerLoop();
    buildProcess.then(() => {
        let allFilesExist = true;

        allFilesExist = checkFiles(root, "./dist") && allFilesExist;
        allFilesExist = checkFiles(icons, "./dist") && allFilesExist;
        allFilesExist = checkFiles(js, "./dist") && allFilesExist;
        allFilesExist = checkFiles(css, "./dist") && allFilesExist;
        allFilesExist = checkFiles(fonts, "./dist") && allFilesExist;
        allFilesExist = checkFiles(img, "./dist") && allFilesExist;

        if (allFilesExist) {
            console.log(chalk.green("Integrity check completed."));
            updateCompleted = true;
        } else {
            console.error(chalk.red("Integrity check failed after rebuilding."));
            console.error(chalk.red("This may be an issue with Daylight."));

            select({
                message: 'Do you wish for Daylight to rebuild?',
                choices: [
                    {
                        name: chalk.green("Yes"),
                        value: 'y',
                        description: 'Depending on the issue with Daylight, this may not fix the issue.',
                    },
                    {
                        name: chalk.red("No"),
                        value: 'n',
                        description: 'The script will end, and Daylight will not start.',
                    },
                    new Separator(),
                    {
                        name: chalk.blue("Update Daylight"),
                        value: 'u',
                        description: "This will fetch the most latest version of Daylight from the GitHub repository."
                    },
                ],
            }).then(async (answer) => {
                if (answer === 'y') {
                    rebuildAndCheckIntegrity();
                } else if (answer === 'n') {
                    console.log(chalk.red("Script terminated by user choice."));
                    exit();
                } else if (answer === 'u') {
                    console.log(chalk.yellow("Updating Daylight..."));
                    updateInProgress = true;
                    updateCompleted = false;
                }
            }).catch(error => {
                console.error(chalk.red("Error handling prompt:"), error);
            });
        }
    }).catch(error => {
        spinner.fail("Rebuilding Daylight failed.");
        console.error(chalk.red("Error during rebuild:"), error);
        rebuildInProgress = false;
    });
}

if (fs.existsSync("./dist")) {
    console.log(chalk.blue("Daylight has been built."));
    console.log(chalk.blue("Verifying integrity of built files..."));

    const distDir = path.resolve("./dist");

    if (!checkFiles(root, distDir) ||
        !checkFiles(icons, distDir) ||
        !checkFiles(js, distDir) ||
        !checkFiles(css, distDir) ||
        !checkFiles(fonts, distDir) ||
        !checkFiles(img, distDir)) {
        console.log(chalk.red("File integrity check failed."), chalk.yellow(" Rebuilding Daylight..."));
        rebuildAndCheckIntegrity();
    } else {
        console.log(chalk.green("Integrity check completed."));
        console.log(chalk.green("Starting", chalk.yellow("Daylight")));
        startServer();
    }
} else {
    console.error(chalk.red("Daylight has not been built. Building..."));
    rebuildAndCheckIntegrity();
}

function startServer() {
    const rh = createRammerhead();
    const rammerheadScopes = [
        '/rammerhead.js',
        '/hammerhead.js',
        '/transport-worker.js',
        '/task.js',
        '/iframe-task.js',
        '/worker-hammerhead.js',
        '/messaging',
        '/sessionexists',
        '/deletesession',
        '/newsession',
        '/editsession',
        '/needpassword',
        '/syncLocalStorage',
        '/api/shuffleDict',
        '/mainport'
    ];

    const rammerheadSession = /^\/[a-z0-9]{32}/;

    function shouldRouteRh(req: http.IncomingMessage) {
        if (!req.url) return false;
        const url = new URL(req.url, 'http://0.0.0.0');
        return (
            rammerheadScopes.includes(url.pathname) ||
            rammerheadSession.test(url.pathname)
        );
    }

    function routeRhRequest(req: http.IncomingMessage, res: http.ServerResponse) {
        rh.emit('request', req, res);
    }

    function routeRhUpgrade(req: http.IncomingMessage, socket: net.Socket, head: Buffer) {
        rh.emit('upgrade', req, socket, head);
    }

    const __dirname = path.resolve();
    const server = http.createServer();
    const app = express();
    

    app.use("/uv/", express.static(uvPath));
    console.log(chalk.red("Serving Ultraviolet's files.."));
    app.use("/epoxy", express.static(epoxyPath));
    console.log(chalk.yellow("Serving Epoxy's files.."));
    app.use("/baremod/", express.static(bareModulePath))
    console.log(chalk.green("Serving Bare's (as module) files.."));
    app.use("/libcurl/", express.static(libcurlPath))
    console.log(chalk.blue("Serving Libcurl's files.."));
    app.use("/baremux/", express.static(baremuxPath));
    console.log(chalk.red("Serving Baremux's files.."));
    app.use("/meteor/", express.static(meteorPath))
    console.log(chalk.blue("Serving Meteor's files.."));
    app.use(express.static(path.join(__dirname, "dist")));
    console.log(chalk.green("Serving", chalk.yellow("Daylight's"), chalk.green("files")));
    console.log(chalk.green("All necessary files served. Setting up server."))
    
}
