import React, { useEffect, useState } from 'react';

import parse from 'parse-curl'
import { useStorage } from "@plasmohq/storage/hook"
import { sendToBackground } from "@plasmohq/messaging"
import Domains from '../components/Domains'


function Authentication() {

    const [whitelistDomains, setWhitelistDomains] = useStorage("domains")

    const [curl, setCurl] = useState('');

    const parser = () => {
        if (curl) {
            const parsed = parse(curl);
            const domain = (new URL(parsed.url)).hostname;
            setWhitelistDomains(val => {
                return {
                    ...val,
                    [domain]: parsed
                }
            })
        }
    }

    return (
        <div>
            <h1 className="text-xl">Authentication Settings</h1>
            <p>Here you can configure your authentication settings.</p>
            <h3 className="text-lg mt-4">Import authentication curl script</h3>
            <div className="flex flex-row mt-4 w-full items-end">
                <textarea className="border-2 grow border-gray-300 p-2" placeholder="Paste curl..."
                    value={curl}
                    onKeyDown={(event) => {
                        // if enter key is pressed, add the domain
                        // if (event.key === 'Enter') {
                        //     setWhitelistDomains([...whitelistDomains, domain]);
                        //     setDomain('');
                        // }
                    }}
                    onChange={(event) => setCurl(event.target.value)}
                />
                <button className="bg-blue-500 text-white py-2 ml-4 px-4"
                    onClick={(event) => {
                        parser()
                    }}
                >Import</button>
            </div>
            <Domains />
        </div>
    );

}

export default Authentication;
