import {formatDistance, parseISO} from "date-fns";
import React, {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";

export default function ReleaseNotes({url}) {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setNotes(data))
            .catch(error => console.error(error))
    }, url)

    return (
        <div>
            {notes.map((releaseNote) => (
                <>
                    <div style={{display: "flex"}}>
                        <h2 style={{flex:1}}>{">"} <a href={releaseNote.html_url} target={"_blank"}>{releaseNote.tag_name}</a></h2>
                        <i>{formatDistance(parseISO(releaseNote.published_at), new Date(), { addSuffix: true })}</i>
                    </div>
                    <ReactMarkdown>{releaseNote.body.replace(/<!--.*-->/, "")}</ReactMarkdown>
                    <hr/>
                </>

            ))}
        </div>
    );
};
