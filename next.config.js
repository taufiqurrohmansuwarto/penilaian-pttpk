// next.config.js
const withAntdLess = require("next-plugin-antd-less");

const withTM = require("next-transpile-modules")([
    "@fullcalendar/common",
    "@babel/preset-react",
    "@fullcalendar/common",
    "@fullcalendar/daygrid",
    "@fullcalendar/interaction",
    "@fullcalendar/react",
    "@fullcalendar/timegrid"
]);

// production
const isProd = process.env.NODE_ENV === "production";

function getBasePath() {
    var basePath = "";

    if (isProd && process.env.BASE_PATH) {
        if (process.env.BASE_PATH.startsWith("/")) {
            basePath = process.env.BASE_PATH;
        } else {
            basePath = "/" + process.env.BASE_PATH;
        }
    }

    return basePath;
}

module.exports = withTM(
    withAntdLess({
        basePath: "/ptt-penilaian",
        publicRuntimeConfig: {
            basePath: getBasePath()
        },
        modifyVars: { "@primary-color": "#04f" }, // optional
        lessVarsFilePath: "./src/styles/variables.less", // optional
        lessVarsFilePathAppendToEndOfContent: false, // optional
        // optional https://github.com/webpack-contrib/css-loader#object
        cssLoaderOptions: {
            // ...
            mode: "local",
            //     localIdentName: __DEV__ ? "[local]--[hash:base64:4]" : "[hash:base64:8]", // invalid! for Unify getLocalIdent (Next.js / CRA), Cannot set it, but you can rewritten getLocalIdentFn
            exportLocalsConvention: "camelCase",
            exportOnlyLocals: false,
            // ...
            getLocalIdent: (context, localIdentName, localName, options) => {
                return "whatever_random_class_name";
            }
        },

        // for Next.js ONLY
        nextjs: {
            localIdentNameFollowDev: true // default false, for easy to debug on PROD mode
        },

        // Other Config Here...

        webpack(config) {
            return config;
        }
    })
);
