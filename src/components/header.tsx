import { IMAGE } from '../config';
import { Text } from './text';

/**
 * Header Component
 * - Logo and version number.
 */
export const Header: React.FC = () => (
    <div
        style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "5px",
            pointerEvents: "none"
        }}
    >
        <img
            src={`${IMAGE}logo.png`}
        />
        <Text text={"v2.0"} type={"shadow"} colour={"white"} />
    </div>
);