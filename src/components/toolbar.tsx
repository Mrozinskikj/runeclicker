import React from 'react';

export const Toolbar: React.FC = () => {
    const linkStyle: React.CSSProperties = {
        color: '#fff',
        textDecoration: 'none',
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
                zIndex: 1000,
                color: '#fff',
                fontSize: '14px',
                paddingLeft: "10px"
            }}
        >
            <p style={{ marginRight: "40px" }}>
                Made by Krzysztof Mrozinski
            </p>
            <p style={{ marginRight: "40px" }}>
                <a href="http://kmroz.com" style={linkStyle}>my website</a>
            </p>
            <p style={{ marginRight: "40px" }}>
                <a href="mailto:krzysztof@kmroz.com" style={linkStyle}>contact me</a>
            </p>
            <p style={{ marginRight: "40px" }}>
                <a href="https://github.com/mrozinskikj/runeclicker" style={linkStyle}>source code</a>
            </p>
        </div>
    );
};