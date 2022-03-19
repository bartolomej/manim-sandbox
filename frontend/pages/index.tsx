import type {NextPage} from 'next'
import Head from 'next/head'
import { useState} from "react";
import Preview from "../components/preview";
import Editor from "../components/editor";
import styled from "styled-components";
import {randomInt} from "../common/utils";

const example = `from manim import *

class MovingAround(Scene):
    def construct(self):
        square = Square(color=BLUE, fill_opacity=1)

        self.play(square.animate.shift(LEFT))
        self.play(square.animate.set_fill(ORANGE))
        self.play(square.animate.scale(0.3))
        self.play(square.animate.rotate(0.4))`;

const Home: NextPage = () => {
    const [url, setUrl] = useState('');
    const [code, setCode] = useState(example);
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
                setUrl(process.env.NEXT_PUBLIC_API_URL + data.out + `?c=${randomInt(1000)}`);
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
                        {loading ? 'Rendering ...' : url ?<Preview url={url} /> : (
                            <p>Press RENDER to show preview. Check <a href="https://docs.manim.community/en/stable/examples.html">manim.community/examples</a> for more examples.</p>
                        )}
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
        margin: 5px;
    }
`;

export default Home
