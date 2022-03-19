import type {NextPage} from 'next'
import Head from 'next/head'
import { useState} from "react";
import Preview from "../components/preview";
import Editor from "../components/editor";
import styled from "styled-components";
import {randomInt} from "../common/utils";

const Home: NextPage = () => {
    const [url, setUrl] = useState('');
    const [code, setCode] = useState('');
    const [log, setLog] = useState('');
    const [loading, setLoading] = useState(false);

    function render() {
        setLoading(true);
        fetch(process.env.NEXT_PUBLIC_API_URL + '/render', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectUid: "test",
                code
            })
        })
            .then(res => res.json())
            .then(data => {
                setUrl(`http://localhost:3000` + data.out + `?c=${randomInt(1000)}`);
                setLog(data.log);
            })
            .catch(error => alert("Error: " + error.message))
            .finally(() => setLoading(false))
    }

    return (
        <Container>
            <Head>
                <title>Manim Sandbox</title>
            </Head>

            <main>
                <IdeContainer>
                    <div>
                        <Editor code={code} onChange={setCode} />
                    </div>
                    <div>
                        {loading ? 'Rendering ...' : <Preview url={url} />}
                    </div>
                </IdeContainer>
                <button onClick={render}>RENDER</button>
            </main>
        </Container>
    )
}

const Container = styled.div`
    padding: 2em;
`;

const IdeContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 50vh;
    & > div {
        flex: 1;
    }
`;

export default Home
