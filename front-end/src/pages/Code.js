import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../Styles/Code.css';
import { getCodeByTitle } from '../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import hljs from "highlight.js";

// import "highlight.js/styles/github.css";


const Code = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [socket, setSocket] = useState(null);
    const [isMentor, setIsMentor] = useState(false);
    const textareaRef = useRef(null);
    const [codeData, setCodeData] = useState(null)
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        console.log("useEffect")
        hljs.highlightElement(textareaRef.current);
    }, []);


    useEffect(() => {
        const newSocket = io('https://moveo-server-z2xn.onrender.com');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCodeByTitle(id);
            setCodeData(data[0]);
        }
        fetchData();
        if (socket) {
            socket.emit('joinRoom', id);

            socket.on('codeChange', (newCode) => {
                if (isMentor) {
                    setCode(newCode);
                    checkSuccess(newCode);
                }
            });
            socket.on('mentorStatus', (status) => {
                setIsMentor(status);
            });
        }
    }, [id, socket, isMentor]);

    const goBack = () => {
        navigate(-1);
    };

    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        checkSuccess(newCode);
        socket.emit('codeChange', { roomId: id, code: newCode });
    };

    const checkSuccess = (newCode) => {

        if (codeData && newCode === codeData.code) {
            setSuccess(true);
        }
        else {
            setSuccess(false)
        }
    }
    useEffect(() => {

    }, [isMentor])

    return (
        <div className="code-div">
            {/* {isMentor &&
                <h1>Mentor</h1>
            } */}
            <h1>Code block details</h1>
            <h2> {id}</h2>
            {/* <pre>
                <code className="language-typescript">const data = { }</code>
            </pre> */}
            <div className="code-block-container">
                <textarea
                    ref={textareaRef}
                    className={`code-block ${isMentor ? 'read-only' : ''}`}
                    placeholder="Write your code here..."
                    value={code}
                    onChange={handleCodeChange}
                    rows={20}
                    cols={50}
                    readOnly={isMentor}
                    spellCheck={false}
                />
            </div>

            {success &&
                <>
                    <FontAwesomeIcon icon={faFaceSmile} size='10x' color='orange' />
                    <h1>Very Good!</h1>
                </>
            }
        </div>
    );
}

export default Code;
