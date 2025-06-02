import React, { ReactNode } from 'react';
import { IMAGE } from '../config';

interface WindowProps {
    content: ReactNode;
    mt?: number;
    mb?: number;
    mr?: number;
    ml?: number;
}

/**
 * Window Component
 * - Draws an interface window containing the content provided in argument.
 */
export const Window: React.FC<WindowProps> = ({
    content,
    mt = 0,
    mb = 0,
    mr = 0,
    ml = 0
}) => (
    <div
        style={{
            backgroundImage: `url(${IMAGE}backgrounds/interface.png)`,
            boxShadow: '0 0 0 1px #000000, 0 0 0 2px #ffffff, 5px 5px 0 rgba(0,0,0,0.5)',
            boxSizing: 'border-box',
            padding: 0,
            marginTop: mt,
            marginBottom: mb,
            marginRight: mr,
            marginLeft: ml,
        }}
    >
        {content}
    </div>

);