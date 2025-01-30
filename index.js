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
import cors from "cors"
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3"
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { meteorPath } from "meteorproxy"
import wisp from "wisp-server-node";
import { createBareServer } from "@tomphttp/bare-server-node"
import RateLimit from "express-rate-limit";
import net from "node:net"
import { hostname } from "node:os"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let updateInProgress = false;
let updateCompleted = false;
let rebuildInProgress = false;
let rebuildCompleted = false;
const bare = createBareServer("/bare/")
console.log(chalk.blue("Starting Daylight"));

function handleTermination(signal) {
    if (updateInProgress) {
        console.log(chalk.red(`Cannot terminate now. Daylight is currently updating. Termination of the script now will brick Daylight. The only way to fix a "bricking" of Daylight, is to completely download it again, and make a new instance.`));
    } else {
        console.log(chalk.blue(`Received ${signal}. Exiting now.`));
        server.close(() => {
            console.log("HTTP server closed");
            server.close()
            bare.close()
            process.exit(1);
        });
    }
}

process.on("SIGINT", () => handleTermination("SIGINT"));
process.on("SIGTERM", () => handleTermination("SIGTERM"));

const root = ["index.html"];
const icons = [
    "assets/icons/lucide.eot",
    "assets/icons/lucide.svg",
    "assets/icons/lucide.ttf",
    "assets/icons/lucide.woff",
    "assets/icons/lucide.woff2",
];
const js = ["assets/js/index.js", "assets/js/index.js.map"];
const css = ["assets/css/index.css"];
const fonts = ["fonts/horizon_outlined.otf", "fonts/horizon.otf"];
const img = ["img/favicon_dark.png", "img/favicon_light.png", "img/bg/bgDark.png", "img/bg/bgLight.png"];
const proxies = [
    "!/meteor.config.js",
    "!/sw.js",
    "!/meteor.bundle.js",
    "!/meteor.bundle.js.map",
    "!/meteor.client.js",
    "!/meteor.client.js.map",
    "!/meteor.codecs.js",
    "!/meteor.config.js",
    "!/meteor.worker.js",
    "!/meteor.worker.js.map",
    "&/sw.js",
    "&/uv.config.js",
    "&/uv.bundle.js",
    "&/uv.bundle.js.map",
    "&/uv.client.js",
    "&/uv.client.js.map",
    "&/uv.handler.js",
    "&/uv.handler.js.map",
    "&/uv.sw.js",
    "&/uv.sw.js.map",
    "~/rh.mjs",
    "$/scramjet.client.js",
    "$/scramjet.client.js.map",
    "$/scramjet.codecs.js",
    "$/scramjet.codecs.js.map",
    "$/scramjet.shared.js",
    "$/scramjet.shared.js.map",
    "$/scramjet.worker.js",
    "$/scramjet.worker.js.map",
    "epoxy/index.js",
    "epoxy/index.mjs",
    "libcurl/index.cjs",
    "libcurl/index.js",
    "libcurl/index.mjs"
];

function checkFiles(files, baseDir) {
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

async function rebuildAndCheckIntegrity() {
    const spinner = ora("Rebuilding Daylight...").start();
    rebuildInProgress = true;

    try {
        await new Promise((resolve, reject) => {
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

        spinner.succeed("Rebuild and verification complete.");

        let allFilesExist = true;

        allFilesExist = checkFiles(root, "./dist") && allFilesExist;
        allFilesExist = checkFiles(icons, "./dist") && allFilesExist;
        allFilesExist = checkFiles(js, "./dist") && allFilesExist;
        allFilesExist = checkFiles(css, "./dist") && allFilesExist;
        allFilesExist = checkFiles(fonts, "./dist") && allFilesExist;
        allFilesExist = checkFiles(img, "./dist") && allFilesExist;
        allFilesExist = checkFiles(proxies, "./dist") && allFilesExist;

        if (allFilesExist) {
            console.log(chalk.green("Integrity check completed."));
            updateCompleted = true;
            startServer();
        } else {
            console.error(chalk.red("Integrity check failed after rebuilding."));
            console.error(chalk.red("This may be an issue with Daylight."));

            const answer = await select({
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
            });

            if (answer === 'y') {
                await rebuildAndCheckIntegrity();
            } else if (answer === 'n') {
                console.log(chalk.red("Script terminated by user choice."));
                exit();
            } else if (answer === 'u') {
                console.log(chalk.yellow("Updating Daylight..."));
                updateInProgress = true;
                updateCompleted = false;
                await updateDaylight();
            }
        }
    } catch (error) {
        spinner.fail("Rebuilding Daylight failed.");
        console.error(chalk.red("Error during rebuild:"), error);
        rebuildInProgress = false;
    }
}

async function updateDaylight() {
    const spinner = ora("Updating Daylight...").start();
    try {
        await new Promise((resolve, reject) => {
            exec("git pull --force --allow-unrelated-histories", (error, stdout, stderr) => {
                if (error) return reject(error);
                console.log(stdout);
                if (stderr) console.error(stderr);
                resolve();
            });
        });
        spinner.succeed("Update completed.");
        await rebuildAndCheckIntegrity();
    } catch (error) {
        spinner.fail("Updating Daylight failed.");
        console.error(chalk.red("Error during update:"), error);
    } finally {
        updateInProgress = false;
    }
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
        !checkFiles(img, distDir) ||
        !checkFiles(proxies, distDir)
    ) {
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

    function shouldRouteRh(req) {
        if (!req.url) return false;
        const url = new URL(req.url, 'http://0.0.0.0');
        return (
            rammerheadScopes.includes(url.pathname) ||
            rammerheadSession.test(url.pathname)
        );
    }

    function routeRhRequest(req, res) {
        rh.emit('request', req, res);
    }

    const __dirname = path.resolve();
    const server = http.createServer();
    const app = express();
    const PORT = process.env.PORT || 8080;

    app.use(express.static(path.join(__dirname, "dist")));
    app.use(cors());

    app.use("/&/", express.static(uvPath));
    console.log(chalk.red("Serving Ultraviolet's files.."));
    app.use("/epoxy/", express.static(epoxyPath));
    console.log(chalk.yellow("Serving Epoxy's files.."));
    app.use("/baremod/", express.static(bareModulePath))
    console.log(chalk.green("Serving Bare's (as module) files.."));
    app.use("/libcurl/", express.static(libcurlPath))
    console.log(chalk.blue("Serving Libcurl's files.."));
    app.use("/baremux/", express.static(baremuxPath));
    console.log(chalk.red("Serving Baremux's files.."));
    app.use("/!/", express.static(meteorPath))
    console.log(chalk.blue("Serving Meteor's files.."));
    console.log(chalk.green("Serving", chalk.yellow("Daylight's"), chalk.green("files")));
    console.log(chalk.green("All necessary files served. Setting up server."))

    // set up rate limiter: maximum of 100 requests per 15 minutes
    const limiter = RateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // max 100 requests per windowMs
    });

    // apply rate limiter to all requests
    app.use(limiter);

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/index.html"));
    });
    app.get("/go", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/index.html"))
    });
    app.get("/settings", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/index.html"))
    })
    app.get("/addons", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/index.html"))
    })
    app.get("/favorites", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/index.html"))
    })
    app.get("/landing", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/index.html"))
    })

    server.on("request", (req, res) => {
        if (bare.shouldRoute(req)) {
            bare.routeRequest(req, res)
        } else if (shouldRouteRh(req)) {
            routeRhRequest(req, res);
        } else {
            app(req, res);
        }
    });

    server.on("upgrade", (req, socket, head) => {
        if (bare.shouldRoute(req)) {
            bare.routeUpgrade(req, socket, head)
        } else if (shouldRouteRh(req)) {
            routeRhUpgrade(req, socket, head);
        } else if (req.url.endsWith("/wisp")) {
            wisp.routeRequest(
                req, socket, head);

        } else {
            socket.destroy();
        }
    });
    server.on("listening", () => {
        const address = server.address();


        const theme = chalk.hex("#FFECA1");

        const host = chalk.hex("#060270");
        console.log(chalk.bold(theme(`
        ██████╗  █████╗ ██╗   ██╗██╗     ██╗ ██████╗ ██╗  ██╗████████╗
        ██╔══██╗██╔══██╗╚██╗ ██╔╝██║     ██║██╔════╝ ██║  ██║╚══██╔══╝
        ██║  ██║███████║ ╚████╔╝ ██║     ██║██║  ███╗███████║   ██║   
        ██║  ██║██╔══██║  ╚██╔╝  ██║     ██║██║   ██║██╔══██║   ██║   
        ██████╔╝██║  ██║   ██║   ███████╗██║╚██████╔╝██║  ██║   ██║   
        ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
                                                                      
        `)));
        console.log(`  ${chalk.bold(host("Local System:"))}            http://${address.family === "IPv6" ? `[${address.address}]` : address.address}${address.port === 80 ? "" : ":" + chalk.bold(address.port)}`);

        console.log(`  ${chalk.bold(host("Local System:"))}            http://localhost${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`);

        try {
            console.log(`  ${chalk.bold(host("On Your Network:"))}  http://${hostname()}${address.port === 8080 ? "" : ":" + chalk.bold(address.port)}`);
        } catch (err) {
            // can't find LAN interface
        }

        if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
            console.log(`  ${chalk.bold(host("Replit:"))}           https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
        }

        if (process.env.HOSTNAME && process.env.GITPOD_WORKSPACE_CLUSTER_HOST) {
            console.log(`  ${chalk.bold(host("Gitpod:"))}           https://${PORT}-${process.env.HOSTNAME}.${process.env.GITPOD_WORKSPACE_CLUSTER_HOST}`);
        }

        if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
            console.log(`  ${chalk.bold(host("Github Codespaces:"))}           https://${process.env.CODESPACE_NAME}-${address.port === 80 ? "" : address.port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`);
        }

    });

    server.listen({ port: PORT });


    server.setMaxListeners(0);



}
