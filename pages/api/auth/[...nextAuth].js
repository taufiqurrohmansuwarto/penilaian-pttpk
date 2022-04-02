import NextAuth from "next-auth/next";
import prisma from "../../../lib/prisma";

const jsonwebtoken = require("jsonwebtoken");

const masterClientId = process.env.MASTER_ID;
const masterClientSecret = process.env.MASTER_SECRET;
const masterWellKnown = process.env.MASTER_WELLKNOWN;
const masterScope = process.env.MASTER_SCOPE;

const pttpkClientId = process.env.PTTPK_ID;
const pttpkClientSecret = process.env.PTTPK_SECRET;
const pttpkWellKnowon = process.env.PTTPK_WELLKNOWN;
const pttpkScope = process.env.PTTPK_SCOPE;

const pttpkFasilitatorClientId = process.env.PTTPKFASILITATOR_ID;
const pttpkFasilitatorClientSecret = process.env.PTTPKFASILITATOR_SECRET;
const pttpkFasilitatorWellKnown = process.env.PTTPKFASILITATOR_WELLKNOWN;
const pttpkFasilitatorScope = process.env.PTTPKFASILITATOR_SCOPE;

export default NextAuth({
    providers: [
        {
            name: "SIMASTER",
            id: "master",
            type: "oauth",
            wellKnown: masterWellKnown,
            clientId: masterClientId,
            clientSecret: masterClientSecret,
            authorization: {
                params: {
                    scope: masterScope,
                    prompt: "login"
                }
            },
            idToken: true,
            checks: ["pkce", "state"],
            profile(profile, token) {
                const currentToken = token.id_token;
                const { role, group, employee_number } =
                    jsonwebtoken.decode(currentToken);

                const currentUser = {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    employee_number: employee_number || "",
                    role,
                    group
                };

                return currentUser;
            }
        },
        {
            name: "PTTPK",
            id: "pttpk",
            type: "oauth",
            wellKnown: pttpkWellKnowon,
            clientId: pttpkClientId,
            clientSecret: pttpkClientSecret,
            authorization: {
                params: {
                    scope: pttpkScope,
                    prompt: "login"
                }
            },
            idToken: true,
            checks: ["pkce", "state"],
            profile(profile, token) {
                const currentToken = token.id_token;
                const { role, group, employee_number } =
                    jsonwebtoken.decode(currentToken);

                const currentUser = {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    employee_number: employee_number || "",
                    role,
                    group
                };

                return currentUser;
            }
        },
        {
            name: "PTTPK FASILITATOR",
            id: "pttpk-fasilitator",
            type: "oauth",
            wellKnown: pttpkFasilitatorWellKnown,
            clientId: pttpkFasilitatorClientId,
            clientSecret: pttpkFasilitatorClientSecret,
            authorization: {
                params: {
                    scope: pttpkFasilitatorScope,
                    prompt: "login"
                }
            },
            idToken: true,
            checks: ["pkce", "state"],
            async profile(profile, token) {
                try {
                    const currentToken = token.id_token;
                    const { role, group, employee_number } =
                        jsonwebtoken.decode(currentToken);

                    const currentUser = {
                        id: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        employee_number: employee_number || "",
                        role,
                        group
                    };

                    const id = profile?.sub?.split("|")?.[1];
                    const from = profile?.sub?.split("|")?.[0];

                    // upsert the user
                    await prisma.users.upsert({
                        where: {
                            custom_id: profile?.sub
                        },
                        create: {
                            group,
                            role,
                            from,
                            id,
                            custom_id: profile?.sub,
                            image: profile?.picture,
                            username: profile?.name
                        },
                        update: {
                            group,
                            from,
                            role,
                            id,
                            image: profile?.picture,
                            username: profile?.name
                        }
                    });

                    return currentUser;
                } catch (error) {
                    console.log(error);
                }
            }
        }
    ],
    callbacks: {
        redirect: async (url, baseUrl) => {
            const urlCallback = `${url?.baseUrl}${process.env.BASE_PATH}`;
            return urlCallback;
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken;
            session.expires = token?.expires;

            // session.scope = token.scope;
            session.user.id = token.id;
            session.user.role = token?.role;
            session.user.group = token?.group;
            session.user.employee_number = token?.employee_number;

            const check = Date.now() < new Date(token?.expires * 1000);

            if (check) {
                return session;
            }
        },
        async jwt({ token, account, isNewUser, profile, user }) {
            if (account) {
                token.accessToken = account?.access_token;

                token.expires = profile.exp;
                token.id = account?.providerAccountId;
                token.role = profile?.role;
                token.group = profile?.group;
                token.employee_number = profile?.employee_number;
            }

            return token;
        }
    },
    theme: "light",
    secret: process.env.SECRET,
    jwt: {
        secret: process.env.SECRET
    }
});
