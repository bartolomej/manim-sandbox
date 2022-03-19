import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {createRef, useEffect, useState} from "react";

const Home: NextPage = () => {
    const videoRef = createRef<HTMLVideoElement>();
    const [filePath, setFilePath] = useState('');
    const [code, setCode] = useState('');
    const [log, setLog] = useState('');
    const [counter, setCounter] = useState(0);

    function render() {
        fetch('http://localhost:3000/render', {
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
                // append useless query to prevent video caching
                setFilePath(`http://localhost:3000` + data.out + `?c=${counter}`);
                setLog(data.log);
                setCounter(prev => prev + 1);
            })
            .catch(error => alert("Error: " + error.message))
    }

    useEffect(() => {
        videoRef?.current?.load();
    }, [filePath])

    return (
        <div className={styles.container}>
            <Head>
                <title>Manim Sandbox</title>
            </Head>

            <main>
                <div className={styles.editor}>
                    <div className={styles.left}>
                        <textarea placeholder="Enter manim code..." onChange={e => setCode(e.target.value)}/>
                    </div>
                    <div className={styles.right}>
                        <video ref={videoRef} controls autoPlay={true} loop={true} crossOrigin="cross-origin">
                            <source src={filePath} type="video/mp4"/>
                        </video>
                    </div>
                </div>
                <button onClick={render}>RENDER</button>
            </main>
        </div>
    )
}

export default Home
