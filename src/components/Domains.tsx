import React, { useEffect, useState } from 'react';

import parse from 'parse-curl'
import { useStorage } from "@plasmohq/storage/hook"
import { sendToBackground } from "@plasmohq/messaging"

function Domains() {
    const [whitelistDomains, setWhitelistDomains] = useStorage("domains")

    const login = async (event, domain) => {
        event.stopPropagation();
        const url = whitelistDomains[domain].url;
        const method = whitelistDomains[domain].method;
        const headers = whitelistDomains[domain].headers;
        const resp = await sendToBackground({
            name: "curl",
            body: whitelistDomains[domain]
        })
        console.log("resp", resp)
        const loginUrl = 'https://' + domain + resp.data.redirect_url
        const loginResp = await sendToBackground({
            name: "curl",
            body: {
                url: loginUrl,
                method: "GET",
                headers: {}
            }
        })
        console.log("loginResp", loginResp)
        if (loginResp.redirected) {
            window.open('https://' + domain, '_blank')
        }
    }

    return <>
        {whitelistDomains && Object.keys(whitelistDomains).length > 0 && (
            <div className="mt-4 w-full">
                <ul>
                    {Object.keys(whitelistDomains).map((domain, index) => (
                        <li className="flex justify-between my-2" key={index}>
                            <a className="text-blue-500 text-md" href={`https://${domain}`} target="_blank">{domain}</a>
                            <div>
                                <button className="text-green-500 ml-2"
                                    onClick={(event) => login(event, domain)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 512 512" fill="currentColor" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                                    </svg>
                                </button>
                                <button className="text-red-500 ml-2"
                                    onClick={(event) => {
                                        setWhitelistDomains(whitelistDomains.filter((d) => d !== domain));
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </>
}

export default Domains
