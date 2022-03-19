import styled from "styled-components";

type Props = {
    code: string;
    onChange: (code: string) => void;
}

export default function Editor({code, onChange}: Props) {
    return (
        <TextArea value={code} onChange={e => onChange(e.target.value)} />
    )
}

const TextArea = styled.textarea`
   width: 100%;
   height: 100%;
   padding: 0;
   margin: 0;
`;