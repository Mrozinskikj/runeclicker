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
        right: 0,
        height: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 1000,
        color: '#fff',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        paddingLeft: '10px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <p style={{ marginRight: '40px' }}>
        made by Krzysztof Mrozinski
      </p>
      <p style={{ marginRight: '40px' }}>
        <a href="https://kmroz.com" style={linkStyle}>
          my website
        </a>
      </p>
      <p style={{ marginRight: '40px' }}>
        <a href="mailto:krzysztof@kmroz.com" style={linkStyle}>
          contact me
        </a>
      </p>
      <p style={{ marginRight: '40px' }}>
        <a
          href="https://github.com/mrozinskikj/runeclicker"
          style={linkStyle}
        >
          source code
        </a>
      </p>
    </div>
  );
};